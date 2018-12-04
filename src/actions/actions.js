// @flow

export type Action = {type: string, value: any};

export const SET_CONFIG = 'setConfig';
export const RECEIVED_FIELDS = 'recievedFields';
export const RECEIVED_DATA = 'recievedData';
export const CHANGE_ROWS_PER_PAGE = 'changeRowsPerPage';
export const CHANGE_ROWS_PER_PIVOT = 'changeRowsPerPivot';
export const ADD_FILTER = 'addFilter';
export const REMOVE_FILTER = 'removeFilter';
export const SET_FILTER_MODE = 'setFilterMode';
export const SET_ADVANCED_FILTERS = 'setAdvancedFilters';
export const SET_START_DATE = 'setStartDate';
export const SET_END_DATE = 'setEndDate';
export const REMOVE_END_DATE = 'removeEndDate';
export const ADD_PIVOT_VIEW = 'addPivotView';
export const REMOVE_PIVOT_VIEW = 'removePivotView';
export const UPDATE_PIVOT_SETTINGS = 'updatePivotSettings';
export const RECEIVED_PROFILE = 'recievedProfile';
export const UPDATED_PROFILE = 'updatedProfile';