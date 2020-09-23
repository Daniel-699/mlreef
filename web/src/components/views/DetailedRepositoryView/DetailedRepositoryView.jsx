import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import './DetailedRepositoryView.scss';
import Navbar from 'components/navbar/navbar';
import MBreadcrumb from 'components/ui/MBreadcrumb';
import ProjectLastCommitSect from 'components/projectView/projectLastCommitSect';
import FilesTable from 'components/files-table/filesTable';
import FilesApi from 'apis/FilesApi';
import {
  arrayOf, shape, number, string, func,
} from 'prop-types';

const filesApi = new FilesApi();

const DetailedRepositoryView = (props) => {
  const {
    selectedProject,
    users,
    match: {
      params: {
        namespace,
        slug,
        branch,
        commit,
        path,
      },
    },
    history,
  } = props;
  const [files, setFiles] = useState([]);
  const finalPath = path || '';
  useEffect(() => {
    if (selectedProject.gitlabId) {
      filesApi.getFilesPerProject(
        selectedProject.gitlabId,
        finalPath,
        false,
        branch || commit,
      ).then((res) => setFiles(res))
        .catch(() => {
          toastr.error('Error', 'Something went wrong getting files');
        });
    }
  }, [selectedProject.gitlabId, finalPath, branch, commit]);
  return (
    <div className="detailed-repository-view">
      <Navbar />
      <div className="container">
        <div className="header">
          <div className="main-content header-content">
            <MBreadcrumb
              items={[{ name: namespace }, { name: slug }, { name: 'Repository' }]}
            />
          </div>
        </div>
        <div className="main-content content">
          <ProjectLastCommitSect
            projectId={selectedProject?.gitlabId}
            lastCommitId={commit}
            branch={branch}
            users={users}
          />
          <br />
          <FilesTable
            isReturnOptVisible={!!finalPath}
            files={files.map((f) => ({ id: `${f.id} ${f.name}`, name: f.name, type: f.type }))}
            headers={['Name']}
            onClick={(e) => {
              const targetId = e.currentTarget.id;
              const file = files.filter((f) => `${f.id} ${f.name}` === targetId)[0];
              if (!file) {
                toastr.error('Error', 'Something wrong browsing app');
                return;
              }
              let link = '/';
              const ref = branch || commit;
              if (file.type === 'blob') {
                link = `/${namespace}/${slug}/-/blob/${branch ? 'branch' : 'commit'}/${ref}/path/${file.path}`;
              } else {
                const linkBase = `/${namespace}/${slug}/-/repository/tree/-`;
                link = `${linkBase}/${branch ? 'branch' : 'commit'}/${ref}/path/${encodeURIComponent(file.path)}`;
              }
              history.push(link);
            }}
          />
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    selectedProject: state.projects.selectedProject,
    users: state.users,
  };
}

DetailedRepositoryView.propTypes = {
  selectedProject: shape({
    gitlabId: number,
  }).isRequired,
  users: arrayOf(shape({})).isRequired,
  match: shape({
    params: shape({
      namespace: string,
      slug: string,
      branch: string,
      path: string,
    }),
  }).isRequired,
  history: shape({ push: func }).isRequired,
};

export default connect(mapStateToProps)(DetailedRepositoryView);
