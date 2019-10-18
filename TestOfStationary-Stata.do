/*
*This file is to perform test of stationary for multiple variables using ADF test
*use varsoc to determine number of lags in ADF
*/

global varlist var1 var2 var3
foreach var of varlist $varlist{ 
  display "******TEST OF STATIONARY FOR `var' ******" 
  varsoc `var'
  mat values= r(stats)
  scalar j=0 //number of lags for Dickey Fuller test
  scalar flag = 1
  forvalues i=2/5{
    scalar pvalue = values[`i',5]
    scalar lag = values[`i',1]
    if(flag==1){
      if (pvalue<.05) { 
        scalar j = j + 1 
        continue
      }
      else{
        scalar j = j
        scalar flag = 2
      }
    }
  }
  display j 
  gen goodlag = j
  qui sum goodlag
  dfuller `var', lags(`r(mean)') trend 
  drop goodlag

  scalar p=r(p) //pvalue from Dickey Fuller test
  if(p<.05){
    display "**`var' is stationary" 
  }
  else{
    display "**`var' is NOT stationary"
  }
}
