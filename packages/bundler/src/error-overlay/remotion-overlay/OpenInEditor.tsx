import React, {
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useRef,
} from 'react';
import {SymbolicatedStackFrame} from '../react-overlay/utils/stack-frame';
import {Button} from './Button';

type State =
	| {
			type: 'idle';
	  }
	| {
			type: 'success';
	  }
	| {
			type: 'load';
	  }
	| {
			type: 'error';
	  };

const initialState: State = {type: 'idle'};

type Action =
	| {
			type: 'start';
	  }
	| {
			type: 'succeed';
	  }
	| {
			type: 'fail';
	  }
	| {
			type: 'reset';
	  };

const reducer = (state: State, action: Action): State => {
	if (action.type === 'start') {
		return {
			type: 'load',
		};
	}

	if (action.type === 'fail') {
		return {
			type: 'error',
		};
	}

	if (action.type === 'reset') {
		return {
			type: 'idle',
		};
	}

	if (action.type === 'succeed') {
		return {
			type: 'success',
		};
	}

	return state;
};

export const OpenInEditor: React.FC<{
	stack: SymbolicatedStackFrame;
}> = ({stack}) => {
	const isMounted = useRef(true);
	const [state, dispatch] = useReducer(reducer, initialState);

	const dispatchIfMounted: typeof dispatch = useCallback((payload) => {
		if (isMounted.current === false) return;
		dispatch(payload);
	}, []);

	const openInBrowser = useCallback(() => {
		dispatch({type: 'start'});
		// eslint-disable-next-line promise/catch-or-return
		fetch(`/api/open-in-editor`, {
			method: 'post',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				stack,
			}),
		})
			.then((res) => res.json())
			.then((data: {success: boolean}) => {
				if (data.success) {
					dispatchIfMounted({type: 'succeed'});
				} else {
					dispatchIfMounted({type: 'fail'});
				}
			})
			.catch((err) => {
				dispatchIfMounted({type: 'fail'});
				console.log('Could not open browser', err);
			})
			.finally(() => {
				setTimeout(() => {
					dispatchIfMounted({type: 'reset'});
				}, 2000);
			});
	}, [dispatchIfMounted, stack]);

	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	const label = useMemo(() => {
		switch (state.type) {
			case 'error':
				return 'Failed to open';
			case 'idle':
				return `Open in ${window.remotion_editorName}`;
			case 'success':
				return `Opened in ${window.remotion_editorName}`;
			case 'load':
				return `Opening...`;
			default:
				throw new Error('invalid state');
		}
	}, [state.type]);

	return (
		<Button onClick={openInBrowser} disabled={state.type !== 'idle'}>
			{label}
		</Button>
	);
};
