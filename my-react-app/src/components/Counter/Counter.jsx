// Counter.jsx - Component demonstrating Redux usage
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  increment,
  decrement,
  incrementByAmount,
  decrementByAmount,
} from '../../store/counterSlice';
import './Counter.css';

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="counter-page">
      <div className="counter-card">
        {/* Header */}
        <div className="counter-header">
          <h2>Redux Toolkit Demo</h2>
        </div>

        {/* Counter Display */}
        <div className="counter-display">
          <div className="counter-value">{count}</div>
          <div className="counter-label">Current Value</div>
        </div>

        {/* Basic Controls */}
        <div className="btn-group">
          <button
            className="counter-btn btn-primary"
            onClick={() => dispatch(increment())}
          >
            <span>+</span> Increment
          </button>
          <button
            className="counter-btn btn-danger"
            onClick={() => dispatch(decrement())}
          >
            <span>−</span> Decrement
          </button>
        </div>

        <div className="section-divider">
          <span>By Amount</span>
        </div>

        {/* Increment by Amount */}
        <div className="btn-group">
          <button
            className="counter-btn btn-warning"
            onClick={() => dispatch(incrementByAmount(2))}
          >
            +2
          </button>
          <button
            className="counter-btn btn-purple"
            onClick={() => dispatch(incrementByAmount(5))}
          >
            +5
          </button>
          <button
            className="counter-btn btn-info"
            onClick={() => dispatch(incrementByAmount(10))}
          >
            +10
          </button>
        </div>

        {/* Decrement by Amount */}
        <div className="btn-group">
          <button
            className="counter-btn btn-warning"
            onClick={() => dispatch(decrementByAmount(2))}
          >
            −2
          </button>
          <button
            className="counter-btn btn-orange"
            onClick={() => dispatch(decrementByAmount(5))}
          >
            −5
          </button>
        </div>

        {/* Educational Section */}
        <div className="info-card">
          <h3>📚 Redux Best Practices</h3>

          <div className="info-section">
            <strong>Why not state.counter++?</strong>
            <ul>
              <li>Redux requires immutable state updates</li>
              <li>Mutations break change detection</li>
              <li>RTK + Immer allows mutation syntax with immutability</li>
            </ul>
          </div>

          <div className="info-section">
            <strong>Advantages of createSlice</strong>
            <ul>
              <li>Less boilerplate code</li>
              <li>Automatic action type generation</li>
              <li>Built-in Immer for immutable updates</li>
            </ul>
          </div>

          <div className="info-section">
            <strong>configureStore benefits</strong>
            <ul>
              <li>Combines reducers automatically</li>
              <li>Enables Redux DevTools Extension</li>
              <li>Adds thunk middleware by default</li>
            </ul>
          </div>
        </div>

        <button className="back-btn" onClick={() => navigate('/welcome')}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Counter;