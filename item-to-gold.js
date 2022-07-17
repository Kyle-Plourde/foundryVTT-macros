/*
iTEM TO GOLD
automates selling items of arbitrary value. When an item's base gold value is entered, 'sell value' is output to chat. Pressing 'Finish' will output the sum of all items 'sold'.
'sell value' is a random value between 50% - 150% of the base gold value
*/


(function ()
{
    let totalValue = 0;

    function sell_value(baseValue)
    {
        if (Number.isInteger(baseValue))
        {
            let sellValue = 0;
            sellValue = (baseValue * (0.5 + ((Math.floor(Math.random() * 11)) / 10)));
            totalValue = totalValue + sellValue;
            let chatContent = `
                <br>Sell Value = ${sellValue}gp
                `;
            let chatData = {
                user: game.user._id,
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
        };

    };
    
    //create dialog box
    let dialog = new Dialog({
        title: "Item => Gold",
        content: ` 
            <p>Enter the base gold value of the item. Its sell value will then be calculated.</p>
            <form>
                <div class="form-group">
                    <label>Base Value</label>
                    <input type="text" inputmode="numeric" pattern= "\d*" id="base-value">
                </div>
            </form>
        `,
        buttons: {
            one: {
                label: "Sell",
                callback: (html) =>
                {
                    let baseValue = parseInt(html.find('[id=base-value]')[0].value);
                    sell_value(baseValue);
                    dialog.render(true);
                }
            },
            two: {
                label: "Finish",
                callback: () =>
                {
                    let chatContent = `
                    <br>Total Sold = ${totalValue}gp
                    `;
                    let chatData = {
                    user: game.user._id,
                    speaker: ChatMessage.getSpeaker(),
                    content: chatContent,
                    type: CONST.CHAT_MESSAGE_TYPES.OTHER
                    };
                    ChatMessage.create(chatData);
                }
            }
        },
        default: "Finish"
    }).render(true);
    
})();
