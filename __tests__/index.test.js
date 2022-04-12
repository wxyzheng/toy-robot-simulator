import { render, screen, fireEvent } from '@testing-library/react';
import Home from '@/pages/index';

const findTextHelper = (node, text) => {
  const hasText = (node) => node.textContent === text;
  const nodeHasText = hasText(node);
  const childrenDontHaveText = Array.from(node.children).every(
    (child) => !hasText(child)
  );
  return nodeHasText && childrenDontHaveText;
};
it('renders a heading', () => {
  render(<Home />);

  const heading = screen.getByText('Toy Robot Simulator');

  expect(heading).toBeInTheDocument();
}),
  it('test valid PLACE command', () => {
    render(<Home />);
    const commandTextArea = screen.getByRole('textbox');
    const placeCommand = 'PLACE 0,0,NORTH\nREPORT\n';

    //input place command in text area
    fireEvent.change(commandTextArea, { target: { value: placeCommand } });

    //check input text
    const placeCommandText = screen.getByText((content, node) =>
      findTextHelper(node, placeCommand)
    );
    expect(placeCommandText).toBeInTheDocument();

    //click run button
    const runButton = screen.getByTestId('run-button');
    fireEvent.click(runButton);

    // display expected result
    expect(screen.queryByTestId('report-text')).toBeInTheDocument();
    expect(screen.getByText('0,0,NORTH')).toBeInTheDocument();
  }),
  it('test invalid PLACE command', () => {
    render(<Home />);
    const commandTextArea = screen.getByRole('textbox');
    const placeCommand = 'PLACE 1,7,NORTH\nREPORT\n';

    //input place command in text area
    fireEvent.change(commandTextArea, { target: { value: placeCommand } });

    //click run button
    const runButton = screen.getByTestId('run-button');
    fireEvent.click(runButton);

    // display expected output (i.e. nothing will display when invalid PLACE command is entered)
    const reportText = screen.queryByTestId('report-test');
    expect(reportText).not.toBeInTheDocument();

    //display error message
    expect(
      screen.getByText(
        'Error: Please enter a valid PLACE command within the table dimensions (5x5)'
      )
    ).toBeInTheDocument();
  }),
  it('test valid MOVE command', () => {
    render(<Home />);
    const commandTextArea = screen.getByRole('textbox');
    const placeCommand = 'PLACE 0,1,NORTH\nMOVE\nREPORT\n';

    //input place command in text area
    fireEvent.change(commandTextArea, { target: { value: placeCommand } });

    //click run button
    const runButton = screen.getByTestId('run-button');
    fireEvent.click(runButton);

    //display expected result
    expect(screen.getByText('0,2,NORTH')).toBeInTheDocument();
    expect(screen.queryByTestId('report-text')).toBeInTheDocument();
  }),
  it('test invalid MOVE command', () => {
    render(<Home />);
    const commandTextArea = screen.getByRole('textbox');
    const placeCommand = 'PLACE 0,0,SOUTH\nMOVE\nREPORT\n';

    //input place command in text area
    fireEvent.change(commandTextArea, { target: { value: placeCommand } });

    //click run button
    const runButton = screen.getByTestId('run-button');
    fireEvent.click(runButton);

    //display expected result
    expect(screen.getByText('0,0,SOUTH')).toBeInTheDocument();
    expect(screen.queryByTestId('report-text')).toBeInTheDocument();
  }),
  it('test valid LEFT command', () => {
    render(<Home />);
    const commandTextArea = screen.getByRole('textbox');
    const placeCommand = 'PLACE 0,0,NORTH\nLEFT\nMOVE\nREPORT\n';

    //input place command in text area
    fireEvent.change(commandTextArea, { target: { value: placeCommand } });

    //click run button
    const runButton = screen.getByTestId('run-button');
    fireEvent.click(runButton);

    //display expected result
    expect(screen.getByText('0,0,WEST')).toBeInTheDocument();
    expect(screen.queryByTestId('report-text')).toBeInTheDocument();
  }),
  it('test valid RIGHT command', () => {
    render(<Home />);
    const commandTextArea = screen.getByRole('textbox');
    const placeCommand = 'PLACE 1,5,WEST\nRIGHT\nMOVE\nREPORT\n';

    //input place command in text area
    fireEvent.change(commandTextArea, { target: { value: placeCommand } });

    //click run button
    const runButton = screen.getByTestId('run-button');
    fireEvent.click(runButton);

    //display expected result
    expect(screen.getByText('1,5,NORTH')).toBeInTheDocument();
    expect(screen.getByTestId('report-text')).toBeInTheDocument();
  }),
  it('test missing PLACE command', () => {
    render(<Home />);
    const commandTextArea = screen.getByRole('textbox');
    const placeCommand = 'RIGHT\nMOVE\nREPORT\n';

    //input place command in text area
    fireEvent.change(commandTextArea, { target: { value: placeCommand } });

    //click run button
    const runButton = screen.getByTestId('run-button');
    fireEvent.click(runButton);

    //display expected result i.e. no output
    expect(screen.queryByTestId('report-text')).not.toBeInTheDocument();

    //display error
    expect(
      screen.getByText(
        'Error: Please enter a valid PLACE command within the table dimensions (5x5)'
      )
    ).toBeInTheDocument();
  }),
  it('test missing commands', () => {
    render(<Home />);
    const commandTextArea = screen.getByRole('textbox');
    const placeCommand = '';

    //input place command in text area
    fireEvent.change(commandTextArea, { target: { value: placeCommand } });

    //click run button
    const runButton = screen.getByTestId('run-button');
    fireEvent.click(runButton);

    //display expected result i.e. no output
    expect(screen.queryByTestId('report-text')).not.toBeInTheDocument();

    //display error
    expect(
      screen.getByText('Error: Please enter a command')
    ).toBeInTheDocument();
  }),
  it('test invalid command', () => {
    render(<Home />);
    const commandTextArea = screen.getByRole('textbox');
    const placeCommand = 'PLACE 1,2,NORTH\nINVALIDCOMMAND\n';

    //input place command in text area
    fireEvent.change(commandTextArea, { target: { value: placeCommand } });

    //click run button
    const runButton = screen.getByTestId('run-button');
    fireEvent.click(runButton);

    //display expected result i.e. no output
    expect(screen.queryByTestId('report-text')).not.toBeInTheDocument();

    //display error
    expect(screen.getByText('Error: Invalid command')).toBeInTheDocument();
  });
