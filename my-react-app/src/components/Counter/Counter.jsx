// Counter.jsx - Component demonstrating Redux usage
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount, incrementBy2, decrementBy2 } from '../../store/counterSlice';

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  // Deliverable 1: Increase counter by 5 (dispatching 5 times)
  const increaseByFive = () => {
    dispatch(increment());
    dispatch(increment());
    dispatch(increment());
    dispatch(increment());
    dispatch(increment());
  };

  // Alternative: Using incrementByAmount action
  const increaseByAmount = (amount) => {
    dispatch(incrementByAmount(amount));
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Redux Counter</h2>
      <h1 style={{ fontSize: '48px', color: '#007bff' }}>{count}</h1>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
        <button 
          onClick={() => dispatch(increment())}
          style={{ padding: '10px 20px', fontSize: '16px' }}
        >
          Increment (+1)
        </button>
        
        <button 
          onClick={() => dispatch(decrement())}
          style={{ padding: '10px 20px', fontSize: '16px' }}
        >
          Decrement (-1)
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={increaseByFive}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#28a745', color: 'white' }}
        >
          Increase by 5 (5 dispatches)
        </button>
      </div>

      <div style={{ marginTop: '10px' }}>
        <button 
          onClick={() => increaseByAmount(10)}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#17a2b8', color: 'white' }}
        >
          Increase by 10 (single dispatch with payload)
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => dispatch(incrementBy2())}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#ffc107', color: '#000' }}
        >
          Increment by 2 (+2)
        </button>
      </div>

      <div style={{ marginTop: '10px' }}>
        <button 
          onClick={() => dispatch(decrementBy2())}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#dc3545', color: 'white' }}
        >
          Decrement by 2 (-2)
        </button>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'left', maxWidth: '600px', margin: '30px auto' }}>
        <h3>Answers to Questions:</h3>
        <p><strong>Counter value after 5 dispatches:</strong> The counter will increase by 5 (from 0 to 5, or whatever current value + 5)</p>
        <p><strong>Decrement action:</strong> The counter <strong>decreases</strong> in value when decrement is called</p>
        <p><strong>Reducer handles decrement:</strong> See counterSlice.js - the decrement reducer subtracts 1 from state.value</p>
        <p><strong>INCREMENTBY2:</strong> New action type that increases counter by 2</p>
        <p><strong>DECREMENTBY2:</strong> New action type that decreases counter by 2</p>
      </div>
    </div>
  );
}

export default Counter;
