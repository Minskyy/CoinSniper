# CoinSniper
### A tool for fetching recently launched tokens on the Binance Smart Chain.

This tool uses the BitQuery api to send GraphQL requests every minute, which retrieve the latest released tokens on the blockchain, which match certain criteria to immediately rule out sure scams.

This info is then fed through the analyzer module, which processes the data in order to look for the most promising tokens.

The processed info is then published through a Telegram bot, so that the user can be alerted of a promising token, even when away from the computer.

In order to be able to receive the updates from the telegram bot, the user would need to get a token from our website. 
This is a simple website which has the fumnctionality of inspecting the balance of a certain token (launched by us) in the Web3 Wallet installed in the user's browser. 
Only if the balance is greater than our defined threshold, a token would be emitted. This way we would create a constant demand for our token.


