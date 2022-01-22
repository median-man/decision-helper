import { useRef, useState } from "react";

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


// - TODO: clicking X removes pick
// - TODO: Form submit picks random number and displays it
// - TODO: Form submit highlights closest matching pick
// - TODO: reset clears picks
// - TODO: clicking go again resubmits form
// - TODO: press ctrl + enter anywhere on doc submits form
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

function App() {
  const [picks, setPicks] = useState([]);
  const [newPick, setNewPick] = useState({ name: "", number: "" });
  const pickNameInputRef = useRef();

  const handleNewPickChange = (event) => {
    const { name, value } = event.target;
    if ((name === "number" && value < 1) || value > MAX_RAND_NUM) {
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

  const handleAddPickKeyDown = (event) => {
    // Do nothing if key is not Enter
    if (event.code !== "Enter") {
      return;
    }

    // Prevent bubbling and submit event on form
    event.preventDefault();
    event.stopPropagation();

    // Add pick to list
    addPick();
  };

  return (
    <Container>
      <header className="px-4 pt-5 text-center">
        <h1 className="display-5 fw-bold">Random Number Decider</h1>
      </header>
      <Row>
        <Col md={8} className="pt-5">
          {/* Decider Inputs */}
          <Form>
            <h2>Add Names/Numbers</h2>
            <p>Numbers must be from 1 to {MAX_RAND_NUM} inclusive.</p>
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
              <h3 className="h6">Add Names/Numbers</h3>
              {/* Inputs for adding picks to the list */}
              <InputGroup className="mb-3" onKeyDown={handleAddPickKeyDown}>
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
              {picks.length === 0 ? (
                <p>You must add at least 2 picks.</p>
              ) : (
                <ListGroup className="w-auto">
                  {picks.map(({ name, number }) => (
                    <ListGroup.Item
                      key={name}
                      className="d-flex justify-content-between"
                    >
                      <div>
                        <Badge
                          bg="secondary"
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
                        className="btn-close"
                        aria-label={`remove ${name}`}
                      ></button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </fieldset>
            <Row>
              <Col>
                <Button type="submit" variant="primary" className="w-100 mt-3">
                  Go
                </Button>
              </Col>
              <Col>
                <Button
                  type="reset"
                  variant="outline-secondary"
                  className="w-100 mt-3"
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col md={4} className="pt-5">
          <aside>
            <h2>Instructions</h2>
            <p>
              This tool will pick a random number from 1 to the {MAX_RAND_NUM}.
              Then, the closest matching pick will be highlighted providing you
              with a quick randomized decision.
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
