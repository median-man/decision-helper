import { useState } from "react";

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

// TODO: implement Row, Col, Container components
// TODO: pressing enter while adding picks should add the pick not submit the form
// TODO: give the name input focus after adding a pick
// TODO: arrow keys should set max number
// TODO: debounced number keys should set max number
// TODO: pressing ctrl+enter should submit the form regardless of which element has focus

function App() {
  const [maxNum, setMaxNum] = useState(20);
  const [picks, setPicks] = useState([]);
  const [newPick, setNewPick] = useState({ name: "", number: "" });

  const handleNewPickChange = (event) => {
    const { name, value } = event.target;
    setNewPick((prev) => ({ ...prev, [name]: value }));
  };

  const isInputInvalid =
    !newPick.name || newPick.number < 1 || newPick.number > maxNum;

  const handleAddPick = () => {
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
  };

  return (
    <Container>
      <header className="px-4 pt-5 text-center">
        <h1 className="display-5 fw-bold">Random Number Decider</h1>
      </header>
      <div className="row">
        <div className="col-md-8 pt-5">
          {/* Decider Inputs */}
          <form>
            <h2>Randomizer Parameters</h2>
            <Form.Group>
              <Form.Label>Maximum Number: {maxNum}</Form.Label>
              <Form.Range
                min={1}
                max={100}
                step={1}
                value={maxNum}
                onChange={(event) => setMaxNum(event.target.value)}
              />
            </Form.Group>
            <fieldset>
              <h3 className="h6">Add Names/Numbers</h3>
              {/* Inputs for adding picks to the list */}
              <InputGroup className="mb-3">
                <FormControl
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
                  max={maxNum}
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
                  onClick={handleAddPick}
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
            <Button type="submit" variant="primary" className="w-100 mt-3">
              GO!
            </Button>
          </form>
        </div>
        <div className="col-md-4 pt-5">
          <aside>
            <h2>Instructions</h2>
            <p>
              This tool will pick and random number from 1 to the chosen
              maximum. Then, the closes matching pick will be highlighted.
            </p>
            <ol>
              <li>Choose maximum number.</li>
              <li>
                Enter names and picked numbers within the range inclusive. (You
                can pick 1 or the maximum.)
              </li>
              <li>
                Click "Decide" to choose a random number and highlight the
                winner.
              </li>
              <li>Click "Reset" to clear selections and start again.</li>
            </ol>
          </aside>
        </div>
      </div>
    </Container>
  );
}

export default App;
