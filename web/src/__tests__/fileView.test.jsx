/* eslint-disable no-undef */
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { FileView } from '../components/fileView/fileView';
import { branchesMock, mockMatchDataCommitDet, projectsArrayMock } from '../testData';

Enzyme.configure({ adapter: new Adapter() });

const wrapper = shallow(
  <FileView
    branches={branchesMock}
    match={mockMatchDataCommitDet}
    projects={projectsArrayMock.projects}
    users={projectsArrayMock.users}
  />,
);

describe('Check for an avatar as the page renders', () => {
  it('should render an avatar', () => {
    wrapper.find('div.commit-pic-circle').find('img').prop('src');
  });
});