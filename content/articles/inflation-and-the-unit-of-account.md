# The unit that quietly changes.

A financial statement usually records money in nominal units. One dollar is written as one dollar whether it is received today or several years from now. That consistency is convenient for bookkeeping, but it can obscure a change in what the money will purchase.

Inflation measures the change in the price of a specified basket of goods and services. It is not a direct measurement of every household's experience. Renters and homeowners, commuters and remote workers, families and retirees can face different changes in their own expenses. A broad index is a reference point, not a complete personal budget.

## Keep nominal and real returns separate

Suppose an investment grows by 6% over a year while the relevant price index increases by 3%. The approximate real return is 3%. The exact relationship is slightly different: divide the investment's growth factor by the price-level growth factor, then subtract one.

```python
nominal_return = 0.06
inflation = 0.03
real_return = (1 + nominal_return) / (1 + inflation) - 1
print(f"{real_return:.2%}")  # 2.91%
```

The subtraction shortcut works reasonably well for small rates. At larger rates, the difference becomes more visible. Being explicit about the formula prevents an approximation from becoming an unexplained convention.

## A long horizon magnifies a small gap

Imagine $10,000 earning a hypothetical 4% annually for ten years, with inflation of 2.5% each year. The ending nominal balance is approximately $14,802. Expressed in starting-year purchasing power, it is about $11,564. This ignores taxes, costs, and uncertainty in both returns and inflation.

The example does not suggest that a stable return or inflation rate is available. It shows why comparing ending balances without a common unit can be misleading. A higher nominal balance can coexist with a much smaller increase in the goods and services it can buy.

## Match the index to the question

An index has a population, basket, geography, weighting method, and publication schedule. It may be revised or seasonally adjusted. A year-over-year change and a one-month annualized change are not interchangeable descriptions of the same movement.

For an ordinary household decision, a detailed expense plan may matter more than choosing between two national measures. A future tuition payment, rent obligation, or medical expense need not grow at the same rate as a broad consumer basket. The mismatch should be visible in the planning assumptions.

## Avoid precision without context

A spreadsheet can calculate a retirement balance to the nearest cent while relying on an inflation assumption that is uncertain by several percentage points. More decimal places do not repair that uncertainty. Scenario ranges can be more honest and more useful than a single apparently exact result.

One practical approach is to compare a base case with higher inflation, lower returns, and an earlier spending date. These scenarios are not assigned probabilities unless there is a defensible reason to do so. They are ways to locate the assumptions that matter most.

The [Bureau of Labor Statistics CPI overview](https://www.bls.gov/cpi/overview.htm) explains the construction and uses of a major consumer price measure. The numerical examples in this essay are hypothetical. They illustrate the importance of a consistent unit of account rather than predicting a future inflation path.
