import { useRef, useState, useEffect, useCallback } from "react";

// UI Components
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// - TODO: reset random number when reset clicked or keypress
// - TODO: deploy after implementing items above
// - TODO: add screenshot to the readme
// - IDEA: persist picks in local storage
// - IDEA: show tooltip or overlay next to number pick input if user tries
//   typing a number out of range
// - IDEA: show an animation while random number is picked
// - IDEA: use and animation/transition to highlight the winner
// - IDEA: save names/picks for later with query params
// - IDEA: dark theme toggle
// - IDEA: multiple themes available
// - IDEA: choose random theme button

// Largest allowable number
const MAX_RAND_NUM = 1000;

// initial pick state
const INIT_PICK = () => ({ name: "", number: "" });

function App() {
  const [randNum, setRandNum] = useState();
  const [picks, setPicks] = useState([
    { name: "one", number: 324 },
    { name: "two", number: 555 },
    { name: "three", number: 845 },
  ]);
  const [newPick, setNewPick] = useState(INIT_PICK);
  const pickNameInputRef = useRef();

  const handleNewPickChange = (event) => {
    const { name, value } = event.target;
    // Value of number can be blank ("") or a value from 1 to the maximum
    if (
      name === "number" &&
      value !== "" &&
      (value < 1 || value > MAX_RAND_NUM)
    ) {
      return;
    }
    setNewPick((prev) => ({ ...prev, [name]: value }));
  };

  const isInputInvalid =
    !newPick.name || newPick.number < 1 || newPick.number > MAX_RAND_NUM;

  const addPick = () => {
    const { name, number } = newPick;
    if (isInputInvalid) {
      // incomplete input
      return;
    }
    // check for duplicates
    for (const pick of picks) {
      if (name.toLowerCase() === pick.name.toLowerCase()) {
        alert("Each name must be unique.");
        return;
      }
      if (number === pick.number) {
        alert("That number has already been picked. Pick another number.");
        return;
      }
    }
    setPicks((prevState) => [...prevState, newPick]);
    setNewPick({ name: "", number: "" });
    pickNameInputRef.current.focus();
  };

  const resetForm = () => {
    setNewPick(INIT_PICK);
    setPicks([]);
  };

  const pickRandom = useCallback(() => {
    if (picks.length > 2) {
      const n = Math.floor(Math.random() * MAX_RAND_NUM) + 1;
      setRandNum(n);
    }
  }, [picks])

  // Keyboard events for entire document
  useEffect(() => {
    const handleDocKeyDown = (event) => {
      // Pressing ctrl+Enter submits form no matter what has focus
      if (event.code === "Enter" && event.ctrlKey) {
        pickRandom();
      }
    };
    document.addEventListener("keydown", handleDocKeyDown);
    return () => {
      document.removeEventListener("keydown", handleDocKeyDown);
    };
  }, [pickRandom]);

  // Keyboard events for entire form
  const handleFormKeyDown = (event) => {
    // Reset the form if shift + enter is pressed
    if (event.code === "Enter" && event.shiftKey) {
      event.stopPropagation();
      event.preventDefault();
      resetForm();
      return;
    }
  };

  // Keyboard events for pick inputs
  const handleAddPickKeyDown = (event) => {
    // If shiftKey is pressed, bubble so that it can propagate to the handler
    // for the Form element.
    if (event.code === "Enter" && !event.shiftKey && !event.ctrlKey) {
      // Prevent bubbling and submit event on form
      event.preventDefault();
      event.stopPropagation();

      // Add pick to list
      addPick();
    }
  };

  // Returns a function which will update the state of picks by removing the
  // pick with a name property that matches the  name parameter.
  const createRemovePickFn = (name) => () =>
    setPicks((prev) => prev.filter((p) => p.name !== name));

  const handleFormSubmit = (event) => {
    event.preventDefault();
    pickRandom();
  };

  // Find the distance from randNum of the closest picked number. Used to
  // highlight the closest pick to the randomly selected number.
  let minDistance = MAX_RAND_NUM + 1;
  if (randNum) {
    picks.forEach(({ number }) => {
      const dist = Math.abs(randNum - number);
      if (dist < minDistance) {
        minDistance = dist;
      }
    });
  }

  return (
    <Container>
      <header className="px-4 pt-5 text-center">
        <h1 className="display-5 fw-bold">Random Number Decider</h1>
      </header>
      <Row>
        <Col lg={8} className="pt-5">
          {/* Decider Inputs */}
          <Form onSubmit={handleFormSubmit} onKeyDown={handleFormKeyDown}>
            <h2 className="d-relative">
              {randNum ? (
                <>
                  The number is{" "}
                  <span className="fw-bold text-primary">{randNum}</span>
                </>
              ) : (
                "Add Names/Numbers"
              )}
            </h2>
            <p className={randNum ? "invisible" : ""}>
              Numbers must be from 1 to {MAX_RAND_NUM} inclusive.
            </p>

            {/*
            Maximum range feature is being considered.
            <Form.Group>
              <Form.Label>Maximum Number: {maxNum}</Form.Label>
              <Form.Range
                // Minimum must not be lower than the greatest picked number
                min={Math.max(...picks.map(p => p.number))}
                max={MAX_RAND_NUM}
                step={1}
                value={maxNum}
                onChange={(event) => setMaxNum(event.target.value)}
              />
            </Form.Group>
            */}
            <fieldset>
              {false || (
                <>
                  <h3 className="h6">Add Names/Numbers</h3>
                  {/* Inputs for adding picks to the list */}
                  <InputGroup onKeyDown={handleAddPickKeyDown}>
                    <FormControl
                      ref={pickNameInputRef}
                      name="name"
                      aria-label="name"
                      aria-describedby="add-pick"
                      placeholder="Enter a name"
                      value={newPick.name}
                      onChange={handleNewPickChange}
                    />
                    <FormControl
                      name="number"
                      aria-label="number"
                      type="number"
                      min={1}
                      max={MAX_RAND_NUM}
                      aria-describedby="add-pick"
                      placeholder="Pick a number"
                      value={newPick.number}
                      onChange={handleNewPickChange}
                    />
                    {/* This button adds a new pick to the list */}
                    <Button
                      type="button"
                      variant="outline-primary"
                      id="add-pick"
                      onClick={addPick}
                      disabled={isInputInvalid}
                    >
                      Add
                    </Button>
                  </InputGroup>
                </>
              )}
              {picks.length === 0 ? (
                <p className="mt-3">
                  Add some names/numbers using the input boxes above.
                </p>
              ) : (
                <ListGroup className="w-auto mt-3">
                  {picks.map(({ name, number }) => {
                    const isClosest =
                      Math.abs(randNum - number) === minDistance;
                    return (
                      <ListGroup.Item
                        key={name}
                        className={`d-flex justify-content-between ${
                          isClosest ? "fw-bold" : ""
                        }`}
                        active={isClosest}
                      >
                        <div>
                          <Badge
                            bg={isClosest ? "light" : "secondary"}
                            text={isClosest ? "dark" : "white"}
                            style={{ width: "3.2em" }}
                            className="me-2"
                          >
                            {number}
                          </Badge>{" "}
                          {name}
                        </div>
                        {/* 
                        react-bootstrap CloseButton seems to be bugged. Using vanilla BS instead.
                        Would like to make it red, but this uses and URL encoded image so color
                        styles won't do the job.
                        
                        TODO: edit svg to red.
                      */}
                        <button
                          type="button"
                          className={`btn-close ${
                            isClosest ? "btn-close-white" : ""
                          }`}
                          aria-label={`remove ${name}`}
                          // Remove this pick
                          onClick={createRemovePickFn(name)}
                        ></button>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              )}
            </fieldset>
            <Row>
              <Col>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 mt-3"
                  disabled={picks.length < 2}
                >
                  Go
                </Button>
              </Col>
              <Col>
                <Button
                  type="reset"
                  variant="outline-secondary"
                  className="w-100 mt-3"
                  onClick={resetForm}
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col lg={4} className="pt-5">
          <aside>
            <h2>Instructions</h2>
            <p>
              A random number from 1 to the {MAX_RAND_NUM} will be picked by
              clicking on "Go". Then, the closest matching pick will be
              highlighted providing you with a quick randomized decision.
            </p>
            <ol>
              <li>
                Add two or more names and their number picks from 1 to{" "}
                {MAX_RAND_NUM}.
              </li>
              <li>
                Click "Go" to choose a random number and highlight the winner.
              </li>
              <li>Click "Reset" to clear selections and start again.</li>
              <li>
                Click the "X" next to a name in the list to remove a pick.
              </li>
            </ol>
          </aside>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
