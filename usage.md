# Spread Optimiser
## A Pokemon EV Spread Optimiser
### Created by Damon Murdoch ([@SirScrubbington](https://twitter.com/SirScrubbington))

## Instructions
This is not a hard-and-fast list of rules for using the application, just a general
process which I usually follow when using it. 

1. Select Species

Using the `species` drop-down, select the Pokemon you'd like to use.

2. Select Nature

The nature will be pre-selected to boost whichever of their stats is highest, 
and reduce whichever of their offensive stats is lowest. If you'd like to use a 
different nature, please select it using the `nature` drop-down. 

3. (Optional) Disable Attack / Special Attack Stat

If your Pokemon is strictly a special attacker, you will want to click on the
attack preset in the `presets` row. Click the option `0/0`, which will result in
0 atk evs and ivs. Likewise, you can select the special attack preset for physical
attackers and set it to option `0`, which will result in 0 special attack evs.

4. Select Speed Preset / Constrain Speed Stat

Click on the `preset` drop-down in the `spe` column. This will bring up the standard 
set of pre-selectable options, as well as a new set at the bottom after `0/0`. These 
are for relevant speed benchmarks such as outspeeding 252+ base 100s, neutral 252 
base 90s, uninvested base 60s, etc. For a detailed list of speed tiers, please refer 
to my [example speed tier document](https://github.com/damon-murdoch/pokemon-speed-tier-generator/blob/main/EXAMPLE.MD), 
or another community speed tier list based on the format you are playing. Generally, 
it is recommended to select a preset or benchmark for a specific Pokemon (or group of 
Pokemon) you'd like to outspeed (e.g. Mega Charizard Y outspeeding Landorus-Therian by 
1 point in 2015). Alternatively, if you have no relevant benchmarks but would like to 
invest a few points for the mirror, you may consider choosing the lowest preset under 
`0/0`, as this may allow you to outspeed some common Pokemon as well as potentially 
providing a speed advantage in the mirror. 

5. Select Boost Stat Preset / Constrain Boost Stat

If your boosted stat is `spe`, this is covered by the previous step and you can skip to `Step 6`.

Click on the `preset` drop-down in the column for whichever stat is boosted by the nature - for 
example, `atk` with an `adamant` nature. This will bring up the standard set of pre-selectable
options, however there will be a new set at the bottom after `0/0`. These are the `jump stats`
for the Pokemon, where you earn 2 points instead of 1 per each 4/8 evs depending on level. 
Generally, it is recommended to select a jump stat as the ev value for your nature boosted 
stat, unless you need to deviate to achieve a specific calc.

6. (Optional) Select HP Stat Filter / Constrain HP Stat

If you do not have any specific limitations for your HP stat, or you are otherwise happy with
the spread as-is, you may skip this step. 

Click on the `preset/filter` drop-down in the `hp` column, and review the options at the bottom
underneath `0`. These are filters which can be applied to your HP stat, e.g. `x/2` is only divisible
by 2, etc. For a table of HP stat filters and their usage, please see below.

| Filter | Effect | Usage |
| ------ | ------ | ----- | 
| x/16 + 1 | Divisible by 16, plus one | Good `Leftovers` / `Grassy Terrain` recovery, brought to just over `50%` by `Super Fang` |
| x/16 | Divisible by 16 | Optimal `Leftovers` / `Grassy Terrain` recovery, brought to exactly `50%` health by `Super Fang` |
| x/10 + 1 | Divisible by 10, plus one | Allows you to attack with `Life Orb` 10 times, surviving with 1 hit point left |
| x/4 + 1 | Divisible by 4, plus one | Allows you to use `Substitute` four times, surviving with 1 hit point left |
| x/4 | Divisible by 4 | Recover exactly `25%` health using `Sitrus Berry`, `Super Fang` activates berry |
| x/2 + 1 | Divisible by 2, plus one | brought to just over `50%` by `Super Fang` |
| x/2 | Divisible by 2 | `Super Fang` activates berry |

7. (Optional) Review Output, apply additional constraints

If you are satisfied with the spread as-is, you may skip this step.

If you want to apply more specific constraints to one or more stats, you may increase or decrease a stat's upper
and lower bounds manually using the input fields `min evs` and `max evs` rows. You will see the spread update in
real-time as you update the constraints. Once satisfied, you may move on to the next step.

8. Export the spread

In the `results` row, you will be able to see the results of the finished spread. You may click `copy evs` to copy
the ev spread to the clipboard (e.g. `4 HP / 244 Atk / 4 Def / 4 SpD / 252 Spe`), or `copy all` to copy the entire
showdown set for the Pokemon - including species, evs, ivs and nature.