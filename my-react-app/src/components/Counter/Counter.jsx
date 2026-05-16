// Counter.jsx - Component demonstrating Redux usage
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount, incrementBy2, decrementBy2, incrementBy5, decrementBy5 } from '../../store/counterSlice';

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

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

      {/* NEW: IncrementBy5 and DecrementBy5 buttons */}
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => dispatch(incrementBy5())}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#6f42c1', color: 'white' }}
        >
          IncrementBy5 (+5)
        </button>
      </div>

      <div style={{ marginTop: '10px' }}>
        <button 
          onClick={() => dispatch(decrementBy5())}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#fd7e14', color: 'white' }}
        >
          DecrementBy5 (-5)
        </button>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'left', maxWidth: '600px', margin: '30px auto' }}>
        <h3>Answers to Questions:</h3>
        <p><strong>Provider:</strong> Makes Redux store available to all components via React Context</p>
        <p><strong>useSelector:</strong> Hook to read specific state from Redux store. Returns the selected value and re-renders component when that value changes.</p>
        <p><strong>INCREMENTBY2:</strong> New action type that increases counter by 2</p>
        <p><strong>DECREMENTBY2:</strong> New action type that decreases counter by 2</p>
        <p><strong>INCREMENTBY5:</strong> New action type that increases counter by 5</p>
        <p><strong>DECREMENTBY5:</strong> New action type that decreases counter by 5</p>
      </div>
    </div>
  );
}

export default Counter;
