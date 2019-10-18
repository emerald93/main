/*This file is to perform coitegration for multiple variables using ADF
*/

global varlist var1 var2 var3 
foreach var of varlist $varlist{ 
  display "******TEST OF COINTEGRATION FOR `var'******" 

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
  display "*`var'_hat is "j //this number shows up correctly
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
