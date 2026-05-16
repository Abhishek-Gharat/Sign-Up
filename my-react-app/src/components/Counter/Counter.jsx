// Counter.jsx - Component demonstrating Redux usage
// Optimized approach: Using action payloads instead of multiple specific actions
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount, decrementByAmount } from '../../store/counterSlice';

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Redux Counter - Optimized Approach</h2>
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

      {/* Optimized: Using single action with payload instead of multiple actions */}
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => dispatch(incrementByAmount(2))}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#ffc107', color: '#000' }}
        >
          Increment by 2 (+2) - Optimized
        </button>
      </div>

      <div style={{ marginTop: '10px' }}>
        <button 
          onClick={() => dispatch(decrementByAmount(2))}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#dc3545', color: 'white' }}
        >
          Decrement by 2 (-2) - Optimized
        </button>
      </div>

      {/* IncrementBy5 and DecrementBy5 using optimized approach */}
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => dispatch(incrementByAmount(5))}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#6f42c1', color: 'white' }}
        >
          IncrementBy5 (+5) - Optimized
        </button>
      </div>

      <div style={{ marginTop: '10px' }}>
        <button 
          onClick={() => dispatch(decrementByAmount(5))}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#fd7e14', color: 'white' }}
        >
          DecrementBy5 (-5) - Optimized
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => dispatch(incrementByAmount(10))}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#17a2b8', color: 'white' }}
        >
          Increase by 10 (single dispatch with payload)
        </button>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'left', maxWidth: '700px', margin: '30px auto', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>📚 Redux Best Practices - Answers:</h3>
        
        <p><strong>Why not state.counter++?</strong></p>
        <ul style={{ marginLeft: '20px' }}>
          <li>Redux requires immutable state updates</li>
          <li>Mutations break change detection (reference equality check)</li>
          <li>Time-travel debugging won't work properly</li>
          <li>RTK + Immer solves this by allowing mutation syntax while keeping immutability</li>
        </ul>

        <p><strong>Problem with identifiers:</strong></p>
        <ul style={{ marginLeft: '20px' }}>
          <li>String action types are error-prone (typos)</li>
          <li>Solution: createSlice generates action types automatically</li>
        </ul>

        <p><strong>Why not keep counter and toggle together?</strong></p>
        <ul style={{ marginLeft: '20px' }}>
          <li>Violates Single Responsibility Principle</li>
          <li>Hard to maintain and scale</li>
          <li>Better to separate into different slices</li>
        </ul>

        <p><strong>Advantages of createSlice:</strong></p>
        <ul style={{ marginLeft: '20px' }}>
          <li>Less boilerplate code</li>
          <li>Automatic action type generation</li>
          <li>Built-in Immer for immutable updates</li>
          <li>Better TypeScript support</li>
        </ul>

        <p><strong>How state.counter++ works in RTK:</strong></p>
        <ul style={{ marginLeft: '20px' }}>
          <li>RTK uses Immer library internally</li>
          <li>You write mutation-style code</li>
          <li>Immer tracks changes and creates new immutable state</li>
          <li>Returns new state to Redux</li>
        </ul>

        <p><strong>configureStore benefits:</strong></p>
        <ul style={{ marginLeft: '20px' }}>
          <li>Combines reducers automatically</li>
          <li>Enables Redux DevTools Extension</li>
          <li>Adds thunk middleware by default</li>
          <li>Simpler API than createStore</li>
        </ul>
      </div>
    </div>
  );
}

export default Counter;
