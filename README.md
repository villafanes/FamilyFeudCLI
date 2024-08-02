# FamilyFeudCLI
CLI 'Family Feud' inspired game.
I developed this game individually over the course of ~10 hours during my participation of the Capital One Tech Mini-Mester program. My requirements were to implement a CLI based program using JavaScript and the npm packages of my choosing.

Challenges:
- I was unable to find a good NLP package to analyze the semantics of the user's answers. In the actual game, the 
 wording of the answer doesn't have to necessarily be perfect, so long as it has the same semantic meaning of one
 of the answer choices. I ended up using the JaroWinklerDistance() functionality of the 'natural' npm package, which calculates
string similarity based on their characters.

- Some of the questions in the dataset I found were not gramatically correct. Given more time, I would process the 
 data to ensure the questions are easily understandable by the user.

Potential Developments:
- I began to develop a speed round option where the user would only get points if they provided a valid answer within
  3 seconds. This would be the next step I would take if I were to continue developing the game.
- The next level of the game would be a multiplayer mode, where the user plays with another player on the same computer within the CLI
   and the points are stored in an alternating way to account for them taking turns.
- Given even more time, I would like to utilize an AI API so the user could compete against an AI model that would be submitting answers against them. This
  would improve the game's understanding of semantics as well.

Sources:
- https://www.npmjs.com/package/csv-parse
- https://www.naukri.com/code360/library/how-to-read-csv-file-in-javascript
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random 
- https://www.npmjs.com/package/chalk 
- https://www.npmjs.com/package/chalk-animation
- https://www.npmjs.com/package/natural/v/0.1.21 
- https://www.npmjs.com/package/inquirer 
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise 
