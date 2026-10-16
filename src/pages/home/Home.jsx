import React, { useState } from 'react';
import './Home.css';
import NewFilePopup from '../../components/FilePopup/NewFilePopup';
import { useNotification } from '../../components/notifier/NotificationProvider';
import { NotificationType, RoutePaths, ModeOfOperation } from '../../Constants';
import DashboardLayout from '../../components/dashboard/Dashboard';
import HeaderTop from '../../components/headerTop/HeaderTop';
import { useNavigate } from 'react-router';
import { CreateNewTopicAPI } from '../../apis/File-api';
import { useAuth } from '../../components/Authentication/AuthProvider';
import { httpErrorHandler } from '../../ErrorHandler/ErrorHandler';
import HomeHeader from './HomeHeader';
import HomeContent from './HomeContent';
import { useLoadingSpinner } from '../../components/loader/LoadingSpinnerProvider';

export default function Home() {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [searchState, setSearchState] = useState({
		isLoading: false,
		results: null,
	});
	const notify = useNotification();
	const navigate = useNavigate();
	const { logout } = useAuth();
	const loader = useLoadingSpinner();

	function openCreateModal() {
		setIsCreateModalOpen(true);
	}

	function closeCreateModal() {
		setIsCreateModalOpen(false);
	}

	async function createFile(NewTopicObj) {
		loader.show("جارٍ إنشاء الملف...");
		try {
			const topic = await CreateNewTopicAPI(NewTopicObj);

			// 201 Created
			notify({
				type: NotificationType.SUCCESS,
				message: "تم إنشاء الملف بنجاح",
				action: {
					text: "إفتح الملف",
					onClick: () =>
						navigate(
							`${RoutePaths.FILE}/${topic.result.order}`,
							{
								state: topic.result
							}
						)
				}
			});

			closeCreateModal();

		} catch (error) {
			httpErrorHandler({
				err: error,
				notify,
				logout,

				onCustomError: (error) => {
					// Request-specific behavior
					console.log("Custom error:", error);
				},
			});
		} finally {
			loader.hide();
		}
	}

	return (
		<>
			<NewFilePopup
				isOpen={isCreateModalOpen}
				onClose={closeCreateModal}
				onSubmit={createFile}
				mode={ModeOfOperation.CREATE}
			/>

			<DashboardLayout
				headerTop={HeaderTop}
				headerBottom={
					<HomeHeader
						openCreateModal={openCreateModal}
						onSearchStateChange={setSearchState}
						isViewingSearchResults={searchState.results !== null}
						isSearchStateActive={searchState.isLoading || searchState.results !== null}
					/>
				}
				children={<HomeContent searchState={searchState} />}
			/>
		</>

	);
}