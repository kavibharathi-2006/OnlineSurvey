
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const API = "http://localhost:5001/surveys";

function App() {
  const [surveys, setSurveys] = useState([]);
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [message, setMessage] = useState("");

  const fetchSurveys = async () => {
    try {
      const response = await axios.get(API);
      setSurveys(response.data);
    } catch (error) {
      setMessage("Cannot connect to server. Please check backend.");
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const createSurvey = async (e) => {
    e.preventDefault();

    if (!question.trim() || !option1.trim() || !option2.trim()) {
      setMessage("Please fill all fields.");
      return;
    }

    try {
      await axios.post(API, {
        question,
        options: [option1, option2],
      });

      setQuestion("");
      setOption1("");
      setOption2("");
      setMessage("Survey created successfully!");
      fetchSurveys();
    } catch (error) {
      setMessage("Unable to create survey.");
    }
  };

  const submitAnswer = async (surveyId) => {
    if (!answers[surveyId]) {
      setMessage("Please select an answer.");
      return;
    }

    try {
      await axios.post(`${API}/${surveyId}/responses`, {
        answer: answers[surveyId],
      });

      setMessage("Your response has been submitted!");
      fetchSurveys();
      showResults(surveyId);
    } catch (error) {
      setMessage("Unable to submit response.");
    }
  };

  const showResults = async (surveyId) => {
    try {
      const response = await axios.get(`${API}/${surveyId}/results`);
      setResults((oldResults) => ({
        ...oldResults,
        [surveyId]: response.data,
      }));
    } catch (error) {
      setMessage("Unable to load results.");
    }
  };

  return (
    <div className="survey-page">
      <div className="container py-5">
        <h1 className="text-center">Online Survey Application</h1>
        <p className="text-center text-muted mb-4">
          Create surveys and share your opinion
        </p>

        {message && (
          <div className="alert alert-info">{message}</div>
        )}

        <div className="card shadow-sm p-4 mb-5">
          <h3>Create a Survey</h3>

          <form onSubmit={createSurvey}>
            <label className="form-label mt-2">Survey Question</label>
            <input
              className="form-control mb-3"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Example: Which programming language do you like?"
            />

            <label className="form-label">Option 1</label>
            <input
              className="form-control mb-3"
              value={option1}
              onChange={(e) => setOption1(e.target.value)}
              placeholder="Example: Java"
            />

            <label className="form-label">Option 2</label>
            <input
              className="form-control mb-3"
              value={option2}
              onChange={(e) => setOption2(e.target.value)}
              placeholder="Example: Python"
            />

            <button className="btn btn-primary" type="submit">
              Create Survey
            </button>
          </form>
        </div>

        <h3 className="mb-3">Available Surveys</h3>

        {surveys.length === 0 && (
          <p className="text-muted">
            No surveys available. Create your first survey above.
          </p>
        )}

        <div className="row">
          {surveys.map((survey) => (
            <div className="col-md-6 mb-4" key={survey._id}>
              <div className="card survey-card p-4 h-100 shadow-sm">
                <h5>{survey.question}</h5>

                {survey.options.map((option) => (
                  <label className="option-item" key={option}>
                    <input
                      type="radio"
                      name={survey._id}
                      value={option}
                      checked={answers[survey._id] === option}
                      onChange={() =>
                        setAnswers((oldAnswers) => ({
                          ...oldAnswers,
                          [survey._id]: option,
                        }))
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))}

                <button
                  className="btn btn-success mt-3"
                  onClick={() => submitAnswer(survey._id)}
                >
                  Submit Response
                </button>

                <button
                  className="btn btn-outline-primary mt-2"
                  onClick={() => showResults(survey._id)}
                >
                  View Results
                </button>

                {results[survey._id] && (
                  <div className="result-box mt-3">
                    <h6>Survey Results</h6>
                    <p>
                      Total responses: {results[survey._id].totalResponses}
                    </p>

                    {results[survey._id].results.map((item) => (
                      <p key={item.option}>
                        {item.option}: {item.votes} votes
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
