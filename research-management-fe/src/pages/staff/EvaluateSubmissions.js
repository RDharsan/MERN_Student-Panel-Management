import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import Loading from '../../components/loading/Loading';
import SubmittedSubmissions from '../../components/submitted-submissions/SubmittedSubmissions';
import { AuthContext } from '../../store/auth';
import { getSubmissionsByPanelIds } from '../../utli/submission.utli';

const EvaluateSubmissions = () => {
	const { getUserInfo } = useContext(AuthContext);
	const userInfo = getUserInfo();
	const [submissions, setSubmissions] = useState([]);
	const [loading, setLoading] = useState(true);

	const loadSubmissions = async () => {
		setLoading(true);
		if (userInfo.panels.length > 0) {
			const response = await getSubmissionsByPanelIds(userInfo.panels);
			if (response.status) {
				setSubmissions(response.submissions);
			}
		} else {
			toast.error('You are not assigned to any panel');
		}
		setLoading(false);
	};

	useEffect(() => {
		loadSubmissions();
	}, []);

	const onEvaluate = (submission) => {
		// find submission and update it
		const newSubmissions = submissions.map((s) => {
			if (s._id === submission._id) {
				s.isEvaluated = true;
				s.marks = submission.marks;
				s.comment = submission.comment;
			}
			return s;
		});
		setSubmissions(newSubmissions);
	};
	return (
		<div className='row'>
			<div className='col-md-12'>
				<h1>Evaluate Submissions</h1>
			</div>
			{loading ? (
				<Loading />
			) : submissions.length > 0 ? (
				<SubmittedSubmissions
					submissions={submissions}
					onEvaluate={onEvaluate}
				/>
			) : (
				<div className='col-md-12 m-2 bg-danger p-4 rounded rounded-3'>
					<h3>No submissions to evaluate</h3>
				</div>
			)}
		</div>
	);
};

export default EvaluateSubmissions;
