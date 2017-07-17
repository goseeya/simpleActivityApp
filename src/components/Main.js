import React, {Component} from 'react';
import { createStore } from 'redux';
import {Provider, connect} from 'react-redux';
import ReactDOM from 'react-dom';
import { combineReducers } from 'redux';

//activity
function activity(state, action) {
  switch (action.type) {
    case 'ADD_ACTIVITY':
      return {
        id: action.id,
        text: action.text,
        completed: false,
        time: action.time
      };
    case 'INCREMENT':
      if(state.id !== action.id) {
        return state;
      }
      return {
        ...state,
        time: state.time+1
      };
      case 'TOGGLE_ACTIVITY':
        if(state.id !== action.id) {
          return state;
        }
      var id = action.id;
      function addInterval() {
        store.dispatch({ type: 'INCREMENT', id: id})
        };
      clearInterval(addInterval);
      setInterval(addInterval, 1000)
    default:
      return state;
  }
};

//activitiess
function activities(state=[], action) {
  switch(action.type) {
    case 'ADD_ACTIVITY':
      return [
        ...state,
        activity(undefined, action)
      ];
    case 'INCREMENT':
      return state.map(a => activity(a, action));
    case 'TOGGLE_ACTIVITY':
      return state.map(a => activity(a, action));
    default:
      return state;
  }
};


//combine reducers
const activityApp = combineReducers({
  activities
});


//create store
const store = createStore(activityApp);


let nextActivityId = 0;
class ActivityApp extends Component {
  render() {
    let list = [];
    if (this.props.activities){
      list = this.props.activities.map(activity =>
      <li key={activity.id} onClick={() => {
        store.dispatch({
          type: 'TOGGLE_ACTIVITY',
          id: activity.id
        });
      }}
      >
      {activity.text} {activity.time}
      </li>
    );
  }
    return (
      <div>
        <input ref={node => {
          this.input = node;
        }}/>
        <button onClick={() => {
          store.dispatch({
            type: 'ADD_ACTIVITY',
            text: this.input.value,
            id: nextActivityId++,
            time: 0
          });
          if(this.input !== null){
            this.input.value = '';
          }
        }}>
        Add Activity
        </button>
        <ul>
          {list}
        </ul>
      </div>
    )
  }
}


const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <ActivityApp activities={store.getState().activities} />
    </Provider>
, document.getElementById('root'));
};

store.subscribe(render);
render();


export default ActivityApp;
