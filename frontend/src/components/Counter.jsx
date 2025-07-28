import { useState } from 'react';

/**
 * A simple counter component that demonstrates the use of the useState hook.
 *
 * @returns {JSX.Element} The rendered counter component.
 */
function Counter() {
  // Declare a state variable 'count' and a function 'setCount' to update it.
  // useState(0) initializes the 'count' state to 0.
  const [count, setCount] = useState(0);

  // This function is called when the button is clicked.
  const handleIncrement = () => {
    setCount(currentCount => currentCount + 1);
  };

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={handleIncrement}>Click me</button>
    </div>
  );
}

export default Counter;
