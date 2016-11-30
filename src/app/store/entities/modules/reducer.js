// @flow
import type { Module } from './';

import validator from './validator';

import findType from '../../../utils/find-type';

import {
  CHANGE_CODE,
  SET_ERROR,
  EDIT_MODULE,
  CANCEL_EDIT_MODULE,
  TOGGLE_MODULE_TREE_OPEN,
  COMMIT_EDIT_MODULE,
} from './actions';

type State = {
  [id: string]: Module;
};

const initialState: State = {};

const moduleReducer = (state: Module, action: Object, wholeState: State): Module => {
  switch (action.type) {
    case CHANGE_CODE:
      return {
        ...state,
        code: action.code,
        type: findType(action.code),
      };
    case SET_ERROR: {
      return {
        ...state,
        error: action.error,
      };
    }
    case EDIT_MODULE: {
      const newEdits = { ...state.edits, error: null, ...action.edits };
      const error = validator(newEdits, state, wholeState);
      newEdits.error = error;
      return {
        ...state,
        edits: newEdits,
      };
    }
    case COMMIT_EDIT_MODULE:
    case CANCEL_EDIT_MODULE: {
      return {
        ...state,
        edits: null,
      };
    }
    case TOGGLE_MODULE_TREE_OPEN: {
      return {
        ...state,
        isTreeOpen: !state.isTreeOpen,
      };
    }
    default:
      return state;
  }
};

export default (state: State = initialState, action: Object): State => {
  switch (action.type) {
    case CHANGE_CODE:
    case SET_ERROR:
    case EDIT_MODULE:
    case CANCEL_EDIT_MODULE:
    case COMMIT_EDIT_MODULE:
    case TOGGLE_MODULE_TREE_OPEN:
      return {
        ...state,
        [action.id]: moduleReducer(state[action.id], action, state),
      };
    default:
      return state;
  }
};