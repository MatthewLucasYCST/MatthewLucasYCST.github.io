/*:
 * @target MZ
 * @plugindesc Advanced Roulette Minigame (Straight / Red-Black / Odd-Even)
 * @author You
 *
 * @command StartRoulette
 * @text Start Roulette
 */

(() => {

    const RED_NUMBERS = [
      1,3,5,7,9,12,14,16,18,
      19,21,23,25,27,30,32,34,36
    ];
    
    PluginManager.registerCommand("AdvancedRoulette", "StartRoulette", () => {
        SceneManager.push(Scene_Roulette);
    });
    
    class Scene_Roulette extends Scene_MenuBase {
    
        create() {
            super.create();
            this._bet = 10;
            this._betType = "straight";
            this._number = 0;
            this.createHelpWindow();
            this.createCommandWindow();
        }
    
        createHelpWindow() {
            this._helpWindow = new Window_Help(3);
            this._helpWindow.setText(this.helpText());
            this.addWindow(this._helpWindow);
        }
    
        createCommandWindow() {
            const rect = new Rectangle(
                0,
                this._helpWindow.height,
                Graphics.boxWidth,
                Graphics.boxHeight - this._helpWindow.height
            );
            this._commandWindow = new Window_Roulette(rect);
            this._commandWindow.setHandler("spin", this.spin.bind(this));
            this._commandWindow.setHandler("cancel", this.popScene.bind(this));
    
            // NEW: Handlers for bet/type/number
            this._commandWindow.setHandler("bet", () => {});
            this._commandWindow.setHandler("type", () => {});
            this._commandWindow.setHandler("number", () => {});
    
            this._commandWindow.onChange = this.updateHelp.bind(this);
            this.addWindow(this._commandWindow);
    
            // NEW: Activate window so you can interact
            this._commandWindow.activate();
        }
    
        helpText() {
            return `Bet: ${this._bet}G
    Type: ${this._betType.toUpperCase()}
    Number: ${this._number}`;
        }
    
        updateHelp(bet, type, number) {
            this._bet = bet;
            this._betType = type;
            this._number = number;
            this._helpWindow.setText(this.helpText());
        }
    
        spin() {
            if ($gameParty.gold() < this._bet) {
                SoundManager.playBuzzer();
                this._helpWindow.setText("Not enough gold!");
                return;
            }
    
            $gameParty.loseGold(this._bet);
    
            const result = Math.floor(Math.random() * 37);
            let win = 0;
    
            switch (this._betType) {
                case "straight":
                    if (result === this._number) win = this._bet * 36;
                    break;
                case "red":
                    if (RED_NUMBERS.includes(result)) win = this._bet * 2;
                    break;
                case "black":
                    if (result !== 0 && !RED_NUMBERS.includes(result)) win = this._bet * 2;
                    break;
                case "odd":
                    if (result % 2 === 1) win = this._bet * 2;
                    break;
                case "even":
                    if (result !== 0 && result % 2 === 0) win = this._bet * 2;
                    break;
            }
    
            let text = `Ball landed on ${result}!\n`;
    
            if (win > 0) {
                $gameParty.gainGold(win);
                SoundManager.playRecovery();
                text += `You WIN ${win} gold! 🎉`;
            } else {
                SoundManager.playMiss();
                text += `You lost ${this._bet} gold.`;
            }
    
            this._helpWindow.setText(text);
        }
    }
    
    class Window_Roulette extends Window_Command {
    
        initialize(rect) {
            super.initialize(rect);
            this._bet = 10;
            this._betType = "straight";
            this._number = 0;
            this.refresh();
        }
    
        makeCommandList() {
            this.addCommand(`Bet: ${this._bet}G`, "bet");
            this.addCommand(`Type: ${this._betType}`, "type");
            if (this._betType === "straight") {
                this.addCommand(`Number: ${this._number}`, "number");
            }
            this.addCommand("SPIN 🎰", "spin");
            this.addCommand("Cancel", "cancel");
        }
    
        cursorRight() {
            this.modifyValue(1);
        }
    
        cursorLeft() {
            this.modifyValue(-1);
        }
    
        modifyValue(amount) {
            const symbol = this.currentSymbol();
            if (symbol === "bet") {
                this._bet = Math.max(10, this._bet + amount * 10);
            }
            if (symbol === "number") {
                this._number = Math.min(36, Math.max(0, this._number + amount));
            }
            if (symbol === "type") {
                const types = ["straight","red","black","odd","even"];
                let i = types.indexOf(this._betType);
                this._betType = types[(i + amount + types.length) % types.length];
            }
            this.refresh();
            this.callHandler("change");
        }
    
        callHandler(name) {
            if (name === "change" && this.onChange) {
                this.onChange(this._bet, this._betType, this._number);
            }
            super.callHandler(name);
        }
    }
    })();
    