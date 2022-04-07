import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

// To ensure that the randomized questions do not change until the page is refreshed
var renderedQuestions = false;

// Used to store the list of 10 random questions to be displayed
var quesList = [];

// The list of all the 37 questions
const questions = [
  {Id: 1, Question: "Caring for people who have suffered is an important virtue."},
  {Id: 2, Question: "I believe that compassion for those who are suffering is one of the most crucial virtues."},
  {Id: 3, Question: "We should all care for people who are in emotional pain."},
  {Id: 4, Question: "I am empathetic toward those people who have suffered in their lives."},
  {Id: 5, Question: "Everyone should try to comfort people who are going through something hard."},
  {Id: 6, Question: "It pains me when I see someone ignoring the needs of another human being."},
  {Id: 7, Question: "The world would be a better place if everyone made the same amount of money."},
  {Id: 8, Question: "Our society would have fewer problems if people had the same income."},
  {Id: 9, Question: "I believe that everyone should be given the same quantity of resources in life."},
  {Id: 10, Question: "I believe it would be ideal if everyone in society wound up with roughly the same amount of money."},
  {Id: 11, Question: "When people work together toward a common goal, they should share the rewards equally, even if some worked harder on it."},
  {Id: 12, Question: "I get upset when some people have a lot more money than others in my country."},
  {Id: 13, Question: "I think people who are more hard-working should end up with more money."},
  {Id: 14, Question: "I think people should be rewarded in proportion to what they contribute."},
  {Id: 15, Question: "The effort a worker puts into a job ought to be reflected in the size of a raise they receive."},
  {Id: 16, Question: "It makes me happy when people are recognized on their merits."},
  {Id: 17, Question: "In a fair society, those who work hard should live with higher standards of living."},
  {Id: 18, Question: "I feel good when I see cheaters get caught and punished."},
  {Id: 19, Question: "I think children should be taught to be loyal to their country."},
  {Id: 20, Question: "It upsets me when people have no loyalty to their country."},
  {Id: 21, Question: "Everyone should love their own community."},
  {Id: 22, Question: "Everyone should defend their country, if called upon. "},
  {Id: 23, Question: "Everyone should feel proud when a person in their community wins in an international competition."},
  {Id: 24, Question: "I believe the strength of a sports team comes from the loyalty of its members to each other."},
  {Id: 25, Question: "I think it is important for societies to cherish their traditional values."},
  {Id: 26, Question: "I feel that most traditions serve a valuable function in keeping society orderly"},
  {Id: 27, Question: "I think obedience to parents is an important virtue. "},
  {Id: 28, Question: "We all need to learn from our elders. "},
  {Id: 29, Question: "I believe that one of the most important values to teach children is to have respect for authority."},
  {Id: 30, Question: "I think having a strong leader is good for society."},
  {Id: 31, Question: "I think the human body should be treated like a temple, housing something sacred within."},
  {Id: 32, Question: "I believe chastity is an important virtue."},
  {Id: 33, Question: "It upsets me when people use foul language like it is nothing."},
  {Id: 34, Question: "If I found out that an acquaintance had an unusual but harmless sexual fetish I would feel uneasy about them"},
  {Id: 35, Question: "People should try to use natural medicines rather than chemically identical human-made ones."},
  {Id: 36, Question: "I admire people who keep their virginity until marriage."}
];

// Used to render each question
function Question(props) {

  // Used to change the form data everytime a radio button is clicked
  function handleChange(event) {
    props.setFormData(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name]: {
          Id: props.data.Id,
          question: props.data.Question,
          response: event.target.value
        }
      }
    })
  }

  return (
  <div className='question-container'>
    <div className='first-row'>Question Id: {props.data.Id}</div>
    <div className='second-row'>Question: {props.data.Question}</div>
    <div className='custom-form-group'>
      <div className='form-check'>
        <input className='form-check-input' type="radio" id="stronglyDisagree" value="Strongly Disagree" name={props.name} onChange={handleChange} />
        <label htmlFor="stringlyDisagree">Strongly Disagree</label>
      </div>
      <div className='form-check'>
        <input className='form-check-input' type="radio" id="disagree" value="Disagree" name={props.name} onChange={handleChange} />
        <label htmlFor="disagree">Disagree</label>
      </div>
      <div className='form-check'>
        <input className='form-check-input' type="radio" id="slightlyDisagree" value="Slightly Disagree" name={props.name} onChange={handleChange} />
        <label htmlFor="slightlyDisagree">Slightly Disagree</label>
      </div>
      <div className='form-check'>
        <input className='form-check-input' type="radio" id="neutral" value="Neutral" name={props.name} onChange={handleChange} />
        <label htmlFor="neutral">Neutral</label>
      </div>
      <div className='form-check'>
        <input className='form-check-input' type="radio" id="slightlyAgree" value="Slightly Agree" name={props.name} onChange={handleChange} />
        <label htmlFor="slightlyAgree">Slightly Agree</label>
      </div>
      <div className='form-check'>
        <input className='form-check-input' type="radio" id="agree" value="Agree" name={props.name} onChange={handleChange} />
        <label htmlFor="agree">Agree</label>
      </div>
      <div className='form-check'>
        <input className='form-check-input' type="radio" id="stronglyAgree" value="Strongly Agree" name={props.name} onChange={handleChange} />
        <label htmlFor="stronglyAgree">Strongly Agree</label>
      </div>
    </div>
  </div>
  );
}

// Used to display all the main content
function DisplayQuestions (props) {

  // Used to save the form state
  const [formData, setFormData] = React.useState({});

  // Used to send the form responses to the backend (Express.js server)
  function handleSubmit(event) {
    console.log(formData);
    fetch('http://localhost:8080/store-data', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(formData)
      }).then(function(response) {
        console.log(response);
      });

    event.preventDefault();
  }

  // Generate the list of 10 random questions to be displayed
  if (renderedQuestions === false && quesList.length === 0) {
    let allQuesList = props.questionList;

    for (let i = 0; i < 10; i++) {
      let qNumber = Math.floor(Math.random() * allQuesList.length);
      let index = allQuesList.findIndex(item => item.Id === qNumber);
      let question = allQuesList.splice(index, 1);
      quesList.push(question[0]);
    }

    renderedQuestions = true;
  }

  const listElements = quesList.map((question) => {
    return (<Question setFormData={setFormData} key={question.Id} name={question.Id} data={question}></Question>);
  });

  return (
  <div>
    <div className='header-container d-flex justify-content-center align-items-center'>
      <h1 className='text-center'>Sample Application</h1>
    </div>
    <div className='container'>
      <form className='custom-form' onSubmit={handleSubmit}>
        {listElements}
          <input className='btn btn-primary custom-btn' type="submit" value="Submit" />
      </form>
    </div>
  </div>
  );
}

// Inject the page content into the root 'div' tag
const element = <DisplayQuestions questionList={questions}></DisplayQuestions>
ReactDOM.render(element, document.getElementById("root"));

