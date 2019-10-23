/*Example project: Forecasting recession in the USA
*Main model: Probit, Poisson
*/

clear all
import excel "data.xls", firstrow
summarize
set more off

gen yq = qofd(date)
format yq %tq
tset yq

gen loil=log(oil)
gen gdp2=gdp[_n-2]
gen u2=u[_n-2]
gen ip2=ip[_n-2]
gen gdp_cli=gdp2*clit
gen gdp_cpi=gdp2*cpi
gen deffr=d.effr
gen dloil=d.loil
gen du2=d.u2


*stationary
	global varlist nber ys clit gdp cpi m2 effr loil u ip sp_cs cs sp500
	foreach var of varlist $varlist{ 
  display "******-----------`var' ------------******" 
		varsoc `var'
		mat values= r(stats)
		scalar j=0
		scalar flag = 1
		forvalues i=2/5{
			scalar pvalue=values[`i',5]
			scalar lag=values[`i',1]

			if(flag==1){
				if (pvalue<.05) { 
					scalar j = j + 1 
					continue
				}
				else{
					scalar j = j
					//continue, break
					scalar flag = 2
				}
			}
			
		}
		display j
		gen goodlag = j
		qui sum goodlag
		dfuller `var', lags(`r(mean)') trend 
		drop goodlag
		
		scalar p=r(p)
		if(p<.05){
			display "**`var' is Stationary" 
		}
		else{
			display "**`var' is NOT stationary"
		}
	}
	dfuller diffdays, lags(1) trend 

*cointegration
	global varlist ys clit gdp cpi m2 effr loil u ip 
	foreach var of varlist $varlist{
		display "******-----------`var' ------------******" 
		
		regress nber `var'
		predict `var'_hat, resid
		
		varsoc `var'_hat
		mat values= r(stats)
		scalar j=0
		scalar flag = 1
		forvalues i=2/5{
			scalar pvalue=values[`i',5]
			scalar lag=values[`i',1]
		
			if(flag==1){
				if (pvalue<.05) { 
					scalar j = j + 1 
				}
				else{
					scalar j = j
					scalar flag = 2
				}
			}
			
		}
		display "*`var'_hat is "j 
		gen goodlag = j
		qui sum goodlag
		dfuller `var'_hat, lags(`r(mean)') trend 
		drop goodlag
			
		scalar p=r(p)
		if(p<.05){
			display "**`var' is cointegration" 
		}
		else{
			display "**`var' is NOT cointegration"
		}

	}
	dfuller u_hat, lags(2) trend

* probit
	global varlist1 nber ys clit gdp2 cpi m2 deffr dloil du2 ip2 

	probit $varlist1
	predict nber_hat
	
	gen cphat=normalden(phat)
	list phat cdfphat cdfphat2 cphat
	gen cdfphat=normprob(phat)
	sum cdfphat2
	scalar scale=r(mean)
	display scale
	
	gen cdfphat2=exp(-phat^2/2)/sqrt(2*3.1415926535897932384626433)
	
	estat classification
	outreg2 using test.doc //export probit result

	margins, dydx($ivlist) atmeans
	marginsplot, noci recast(line) recastci(rarea)
	marginsplot, x(du2)
	margins, predict(pu0) dydx(*)
	margins ys, predict(pu0) if ys
	*asdoc margins, dydx($ivlist) atmeans //export results to doc file
	
	marginsplot 
	mat me=r(b) //matrix of all marginal effect dy/dx
	mat list me
	
	mat b=e(b)
	mat list b
	
	forvalues i=1/12{ //number of dependent variable =12
		scalar b`i'=b[1,`i']
		display "b`i' is " b`i'
	}
	gen probit_hat=ys*b1+clit*b2+gdp2*b3+cpi*b4+m2*b5+d.effr*b6+d.loil*b7+d.u2*b8+ip2*b9+b10
	gen phat=exp(probit_hat)/(1+exp(probit_hat))
	asdoc list date nber nber_hat probit_hat phat, save("Myfile.doc")
	drop probit_hat
	drop phat
	drop nber_hat

*POISSON
	global varlist1 diffdays ys clit gdp2 cpi m2 deffr dloil du2 ip2
	poisson $varlist1
	predict diff_hat
	list date diffdays diff_hat
	
	estat gof
	predict phat2
	gen ephat2=exp(phat2)
	sum phat2
	drop ephat2
	scalar scale=r(mean)
	display scale
	gen change=diffdays-phat2
	predict phatres, res
	asdoc list date phat2 diffdays change
	marginsplot, recast(line) recastci(rarea)
	marginsplot,  recastci(rarea)

	
	mat b=e(b)
	mat list b
	forvalues i=1/12{
		scalar b`i'=b[1,`i']
		scalar apeb`i'=b[1,`i']*scale
		display "apeb`i' is " apeb`i'
	}
	

*Forcasting
	predict probit_res
	predict xb, xb //predicted probability of nber=1
	list nber phat probit_hat probit_res xb
	
	forecast create kleinmodel 
	forecast estimates klein
	
	gen phat2= phat[_n-2]
	gen phat1= phat[_n-1]
	regress phat  phat2
	
	predict pf2
	drop pf
	list nber pf2 pf phat in 250/276
	varsoc nber
	dfuller
	 
	twoway (tsline nber) //check if need d.
	 ac nber //AR
	 pac nber //AR 
	 arima diffdays, arima(2,0,3) 
	estat ic
	gen t=_n
	sum
	arima nber if t<274, arima (2,0,3)
	drop nber_hat
	predict nber_hat
	list yq nber nber_hat 
	tsline nber nber_hat if t>270, xline(275)
	
	margins, at(nber=0)
	
	corrgram diffdays
	ac diffdays
	pac diffdays
	arima nber, arima(2,0,1)
	predict arimanber
	list arimanber nber
	estat ic

*Survival analysis
	*create number of dates till the next recession
	gen date2 = string(yq) //how many days from to the date
	gen recessdate = date2 if nber2==1 & nber2[_n-1]==0
	destring recessdate, replace
	gen recessdate2 = recessdate if nber2==1
	forval i=1/100{
		replace recessdate2 = recessdate2[_n+1] if recessdate2==.
	}
	//drop recessdate2
	//drop recessdate
	//drop diffdays
	destring date2, replace
	gen diffdays = recessdate2 - date2
	replace diffdays = 0 if nber2==1
	
	
	stset diffdays, failure(nber2==1)
	list date nber nber2 diffdays _st _d _t _t0 in 1/30
	stdescribe
	stvary
	
	gen deffr=d.effr
	gen dloil=d.loil
	gen du=d.u
	global varlist1 nber ys clit gdp cpi m2 deffr dloil du ip   
	stcox $varlist1 //, nohr efron vce(robust) nolog //cluster(date)
	

