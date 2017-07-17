import React, {Component} from 'react';
import { createStore } from 'redux';
import {Provider, connect} from 'react-redux';
import ReactDOM from 'react-dom';
import { combineReducers } from 'redux';

//reducer activity
function activity(state, action) {
  switch (action.type) {
    case 'ADD_ACTIVITY':
      return {
        id: action.id,
        text: action.text,
        completed: false,
        time: action.time
      };
    case 'TOGGLE_ACTIVITY':
      if(state.id !== action.id) {
        return state;
      }
      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};

// reducer activitiess
function activities(state=[], action) {
  switch(action.type) {
    case 'ADD_ACTIVITY':
      return [
        ...state,
        activity(undefined, action)
      ];
    case 'TOGGLE_ACTIVITY':
      return state.map(a => activity(a, action));
    default:
      return state;
  }
};

//reducer visibilityFilter
function visibilityFilter(state='SHOW_ALL', action) {
  switch(action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
}


//combine reducers
const activityApp = combineReducers({
  activities,
  visibilityFilter
});


//create store
const store = createStore(activityApp);



let nextActivityId = 0;
class ActivityApp extends Component {
  render() {
    let currentdate = new Date();
    let printDatetime = "Time started: " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    let list = [];
    if (this.props.activities){
      list = this.props.activities.map(activity =>
      <li key={activity.id} onClick={() => {
        store.dispatch({
          type: 'TOGGLE_ACTIVITY',
          id: activity.id
        });
      }}
      style={{
        textDecoration:
          activity.completed ?
          'line-through' :
          'none'
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
            time: printDatetime
          });
          if(this.input !== null){
            this.input.value = '';
          }
        }}>
        AddActivity
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

// React Components

class Activity extends React.Component {
  add() {
    this.props.dispatch({
      type: 'ADD_ACTIVITY'
    });
  }
  toggle() {
    this.props.dispatch({
      type: 'TOGGLE_ACTIVITY'
    });
  }
}

class Activities extends React.Component {
  add() {
    this.props.dispatch({
      type: 'ADD_ACTIVITY'
    });
  }
  toggle() {
    this.props.dispatch({
      type: 'TOGGLE_ACTIVITY'
    });
  }
}


export default ActivityApp;
