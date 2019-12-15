# TheoTrade_Weely_Expected_Move 
# Copyright TheoTrade LLC
# V08.11.2017
# Free for use. Header credits must be included when any form of the code included in # this package is used. 
# 
# User assumes all risk. Author not responsible for errors or use of tool. 
# scripted by Todd Rind
# 
# Thanks to all those who have freely shared ThinkScript concepts over the Web. 
# 
# The study is used to analyze the DAILY CLOSING performance of an equity against 
# the expected move (EM) for any ticker. 
# The study works for daily aggregation only. 
# Best performance will be against ETF's due to the option and stock implied volatility 
# typically being close. When looking at equities, earnings will cause a difference 
# between volatility for options and stock. That is, option volatility may be 
# elevated as compared to the stock volatility. Since option volatility cannot 
# be accessed from ThinkScript, the script EM will be lower than the EM found 
# in the option chain. 
# 
# NEW LOGIC 
# 
# Drawing line from previous close. 
# Completed the daily calculations for inside EM. 
# Turned the "dots" for the bars exceeding EM to RED. 
# Added logic for "touches". The "dots" for touches are BLUE. 
# Touches are a calculated bandwidth around the EM bars. EX: 
# High touches occur when either the high or close is within the calculated 
# bandwith of the EM. Default is 90% of EM. 
# 
# MINOR ISSUES TO MONITOR 
# 
# Remove the bars not marked with EM levels from the % occurance calculation. 
# Fixed by making sure high & low bar > 1. 
# 
# Note sent to TOS Support about counter issues when checking day number-no response 
# from TO. It appears that occasionally a bar out of view is used as the start. 
# Seems to sometimes make Friday count one to many. 
# 
#-------------------- Header End ----------------------------

def agg = GetAggregationPeriod();

def err_label = if agg == AggregationPeriod.DAY then
no
else
yes;

AddLabel(err_label, "Expected Move Study works with daily aggregation only.", Color.PINK);

input em_put_skew_multi = 1.5;
input show_em_calc = yes;

def ivlast;
def expmove;
def high_bar;
def low_bar;
def em_close;


############ logic to check for holidays ######### 
# 
# Change EM calculation on Monday (Day #1) or when last trading day 
# was a Friday (Day #5) and the current day is Tuesday (Day #2). 
# 
# Continue assumption that EM is being calculated on a Saturday. 6 days 
# to expire. 
# 
#

def ymd = GetYYYYMMDD();
def tooday = GetDayOfWeek(ymd);
if tooday == 1 or (GetDayOfWeek(ymd[1]) == 5 and tooday == 2)
then {
    ivlast = imp_volatility()[1];
    expmove = close[1] * ivlast * Sqrt(6 / 365);
    high_bar = close[1] + expmove;
    low_bar = close[1] - expmove * em_put_skew_multi;
    em_close = close[1];
}
else {
    ivlast = ivlast[1];
    expmove = expmove[1];
    high_bar = high_bar[1];
    low_bar = low_bar[1];
    em_close = em_close[1];
}



###################
plot spxhigh = if high_bar < 1 then Double.NaN else high_bar;

spxhigh.SetDefaultColor(Color.GREEN);
spxhigh.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
spxhigh.SetLineWeight(2);

plot spxlow = if low_bar < 1 then Double.NaN else low_bar;

spxlow.SetDefaultColor(Color.RED);
spxlow.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
spxlow.SetLineWeight(2);

plot spxzero = if em_close < 1 then Double.NaN else em_close;

spxzero.SetDefaultColor(Color.BLACK);
spxzero.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
spxzero.SetLineWeight(2);


AddLabel(show_em_calc, "IV[1] = " + ivlast,  Color.LIME);
AddLabel(show_em_calc, "EM[1] = " + expmove, Color.LIME);
