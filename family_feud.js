// npm packages
import fs from 'fs';
import {parse} from 'csv-parse';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import natural from 'natural';
import inquirer from 'inquirer';


const path = "./FamilyFeud_Data.csv";
const questions_dict = {}; // holds questions and answers
const resolveAnimations = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms)); 


// ensure all questions are formatted the same
function cleanQuestions(question) {
    if ((question[0] == '"') && (question[question.length - 1] == '"')) { // remove surrounding quotes, if any
        question = question.substring(1, question.length - 1);
      }

    if (question[question.length - 1] != "?") { // append a question mark if not already present
        question += '?'; 
    }
    return question
}


// loads game questions from csv into a dictionary of strings and inner dictionaries
function loadQuestions() {
    return new Promise((resolve, reject) => { // returns if async function executes successfully
        fs.createReadStream(path)

            .pipe(parse({ delimiter: ',', from_line: 1 }))
            .on('data', function (row) { // enters each row to separate question + answers
                const question = cleanQuestions(row[0]);
                const answers = row.slice(1, 8); // 7 answers
                
                const answer_points = {}; // creates inner dictionary to store points for each question
                for (let i = 0; i < answers.length; i++) {
                    answer_points[answers[i]] = answers.length - i; 
                }
                questions_dict[question] = answer_points; // pushes to main dictionary
            })
            .on('end', function () { // runs function
                resolve(); 
            })
            .on('error', function (error) { // catches error
                reject(error);
            });
    });
}


// generates random questions 
function randomQuestion() {
    const question_set = Object.keys(questions_dict); 
    const random_num = Math.floor(Math.random() * question_set.length); // random values

    const question = question_set[random_num]; // selects random question
    const answers = questions_dict[question]; // holds answers to that question

    return {question, answers}; 
}


// function called to initiate the game
async function startGame() {
    console.log("Let's play Family Feud!");
    const {choice} = await inquirer.prompt([ // takes in user input
        {
          type: 'list',
          name: 'choice',
          message: 'Choose an option:',
          choices: ['Instructions', "Let's Play!"]
        }
      ]);

      if (choice === 'Instructions') { // explains game if user chooses to 
        console.log(chalk.yellow("You will be given 10 prompts. \nIf your answers earn 40 points or more, you win! \nIf not, you will be haunted by the ghost of Steve Harvey until you win a round of Family Feud. \nLet's Play!"));
      }
      playGame();
}

// game inner-workings function
async function playGame() {
    let points = 0;

    for (let i = 0; i < 10; i++) { // 1 round only consists of 10 questions
        const {question, answers} = randomQuestion();
        console.log(chalk.blue(`#${i + 1}: ${question}`));

        const { guess } = await inquirer.prompt([ // takes in user's answer
            {
                type: 'input',
                name: 'guess',
                message: 'Your guess:'
            }
        ]);

        let points_earned = 0; // points gained each round, reset each iteration
        let valid = false;

        for (let answer in answers) { // sees if user guess is similar to any of the answers
            const similarity = natural.JaroWinklerDistance(guess, answer); // JWD calculates string similarities
            if (similarity > 0.7) { // difference threshold of 30%
                points_earned = answers[answer];

                console.log(chalk.green(`You said ${guess}... \n`));

                const bing = chalkAnimation.rainbow(`BING! \n`); 
                await resolveAnimations(); // using solution.js eethod
                bing.stop();

                console.log(chalk.green(`\nYou get ${chalk.bold(points_earned)} points.`)) 

                valid = true;
                break;
            }
        }
        if (!valid) {
            console.log(chalk.red(`Wow, weird answer. No points for that one.`)); // user's answer was not common
        }

        points += points_earned; // increments total points by points earned this round
    }


    if (points >= 40) { // sees if winning requirement of 40 points is met
        console.log(chalk.green(`You got ${points} points.`))
        const winner = chalkAnimation.rainbow("Congratulations! You've just won Family Feud!");
        await resolveAnimations(3000); // plays animation for 3 seconds
        winner.stop();
      } else {
        console.log(chalk.red(`Yikes! You only got ${chalk.bgRed.black(points)} points. See you later! Love, Steve Harvey's ghost`));
      }
}

loadQuestions() // called to read file and create questions_dict
    .then(() => startGame()) // handles Promise within loadQuestions(), calls startGame() if no errors
    .catch(err => console.error(err)); // catches errors

