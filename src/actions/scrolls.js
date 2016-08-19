export const END_DRAG = 'END_DRAG';

export function endDrag(isDragStarted) {
  return (dispatch) => {
    dispatch({ type: END_DRAG, isDragStarted });
  };
}
