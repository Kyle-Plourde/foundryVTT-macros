/*
BUSINESS PROFITS
Calculates profits/losses of a party-owned business, according to the modified rules contained in "Trollskull Alley - a Waterdeep: Dragon Heist DM's Resource" by Eventyr Games:
https://www.dmsguild.com/product/253999
*/


(function ()
{
    //global variables init
    let finalProfit = 0;
    let regularExpenses = -60;
    let multiplierBonus = 0;
    let downtimeBonus = 0;
    let message = ``;
    
    //helper functions
    function chat (chatContent) {
        let chatData = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker(),
            content: chatContent,
            type: CONST.CHAT_MESSAGE_TYPES.OTHER
        };
        ChatMessage.create(chatData);
    }
    
    function promo_bonus(promoGold) //sets multiplierBonus
    {
        if (Number.isInteger(promoGold))
        {
            multiplierBonus = Math.floor(promoGold/10);
            regularExpenses -= promoGold;
            let chatContent = `
            <br>Multiplier Bonus = ${multiplierBonus}`;
            let chatData = {
                user: game.user_id,
                speaker: ChatMessage.getSpeaker(),
                content: chatContent,
                type: CONST.CHAT_MESSAGE_TYPES.OTHER
            };
            ChatMessage.create(chatData);            
        }
    }
    
    function downtime_check(checkResult) //parses check and adds to downtimeBonus
    {
        if (Number.isInteger(checkResult))
        {
            if (checkResult < 1) {
                downtimeBonus -= 5;
            }
            else if (checkResult < 10) {
                downtimeBonus += 0;
            }
            else if (checkResult < 15) {
                downtimeBonus += 3;
            }
            else if (checkResult < 20) {
                downtimeBonus += 5;
            }
            else {
                downtimeBonus += 10;
            }
            let chatContent = `
            <br>Downtime Bonus = ${downtimeBonus}`;
            let chatData = {
                user: game.user_id,
                speaker: ChatMessage.getSpeaker(),
                content: chatContent,
                type: CONST.CHAT_MESSAGE_TYPES.OTHER
            };
            ChatMessage.create(chatData);            
        }
        else {
            let chatContent = `
            <br>Please input integer`;
            let chatData = {
                user: game.user._id,
                speaker: ChatMessage.getSpeaker(),
                content: chatContent,
                type: CONST.CHAT_MESSAGE_TYPES.OTHER
            };
            ChatMessage.create(chatData);            
        }
    }
    
    function final_total() //calculates the final profit/loss
    {
        let d100 = Math.floor(Math.random() * 100) + 1;
        let finalRoll = d100 + downtimeBonus;
        let calcMessage = `<br>1d100 = ${d100}<br>Final Roll: ${d100} \+ ${downtimeBonus} = ${finalRoll}`;
        chat(calcMessage);
        //let finalMultiplier = 
        
        if (finalRoll < 21) {
            finalProfit = regularExpenses * 1.5
             message = `<br>You must pay one and a half times the business’s maintenance cost for each of the days.<br>Net Profit = ${finalProfit}gp`;
        }
        else if (finalRoll < 31) {
            finalProfit = regularExpenses;
             message = `<br>You must pay the business’s full maintenance cost for each of the days.<br>Net Profit = ${finalProfit}gp`;            
        }
        else if (finalRoll < 41) {
            finalProfit = regularExpenses / 2;
             message = `<br>You must pay half the business’s maintenance cost for each of the days. Profits cover the other half.<br>Net Profit = ${finalProfit}`;
        }
        else if (finalRoll < 61) {
            finalProfit = 0;
             message = `<br>The business covers its own maintenance cost for each of the days.<br>Net Profit = ${finalProfit}`;            
        }
        else if (finalRoll < 81) {
            finalProfit = (Math.floor(Math.random() * 6) + 1) * (5 + multiplierBonus);
             message = `<br>The business covers its own maintenance cost for each of the days. It earns a profit of 1d6 × ${5 + multiplierBonus} gp.<br>Net Profit = ${finalProfit}`;
        }
        else if (finalRoll < 91) {
            finalProfit = ((Math.floor(Math.random() * 8) + 1) + (Math.floor(Math.random() * 6) + 1)) * (5 + multiplierBonus);
             message = `<br>The business covers its own maintenance cost for each of the days. It earns a profit of 2d8 × ${5 + multiplierBonus} gp.<br>Net Profit = ${finalProfit}`;
        }
        else {
            finalProfit = ((Math.floor(Math.random() * 10) + 1)+(Math.floor(Math.random() * 10) + 1)+(Math.floor(Math.random() * 10) + 1)) * (5 + multiplierBonus);
             message = `<br>The business covers its own maintenance cost for each of the days. It earns a profit of 3d10 × ${5 + multiplierBonus} gp.<br>Net Profit = ${finalProfit}`;
        }
        
        let chatData = {
            user: game.user_id,
            speaker: ChatMessage.getSpeaker(),
            content: message,
            type: CONST.CHAT_MESSAGE_TYPES.OTHER
        };
        ChatMessage.create(chatData);
    }
    
    //1. promo dialog
    let dialogPromotion = new Dialog({
        title: "Business Profits",
        content: `
            <p>Each tenday, the costs and profit of your business are calculated. The regular expenses are 60 gp per tenday.<br>Promotion can be added to the regular expenses of the business to influence your profits. For each 10 gp spent, the profit multiplier increases by 1 (max 10).</p>
            <form>
                <div class="form-group">
                    <label>Gold Spent</label>
                    <input type="text" inputmode="numeric" pattern= "\d*" id="promo-gold">
                </div>
            </form>
        `,
        buttons: {
            one: {
                label: "Next",
                callback: (html) =>
                {
                    let promoGold = parseInt(html.find('[id=promo-gold]')[0].value);
                    promo_bonus(promoGold);
                    dialogDowntime.render(true);
                }
            }
        },
        default: "Next"
    }).render(true);
    
    //2. downtime dialog
    let dialogDowntime = new Dialog({
        title: "Business Profits",
        content: `
            <p>If a character spends downtime working on the business, they roll a skillcheck for each 5 days of downtime spent. Each check gives a bonus to the profit roll.</p>
            <form>
                <div class="form-group">
                    <label>Skill Check Result</label>
                    <input type="text" inputmode="numberic" pattern= "\d*" id="check-result"
                </div>
            </form>
        `,
        buttons: {
            one: {
                label: "Calculate",
                callback: (html) =>
                {
                    let checkResult = parseInt(html.find('[id=check-result]')[0].value);
                    downtime_check(checkResult);
                    dialogDowntime.render(true);
                }
            },
            two: {
                label: "Finish",
                callback: () =>
                {
                    final_total();
                }                
            }
        },
        default: "Calculate"
    })
    
    
    
})();