import styled from 'styled-components';

// APP
export const Wrapper = styled.div`
  background-color: ${props => props.theme.colorGreyLight};
`;

export const Main = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;

  @media (max-width: 50em) {
    grid-template-columns: 1fr;
  }
`;

export const MapSection = styled.main`
  height: 100vh;
  margin: 0;
  padding: 0;

  @media (max-width: 50em) {
    height: 60vh;
    grid-row: 1 / 2;
  }
`;

export const GoogleMap = styled.div`
  height: 100%;
`;

export const theme = {
  colorPrimary: '#9b63f8',
  colorSecondary: '#819ff9',
  colorWhite: '#fff',
  colorGreyLight: '#f8f9fd',
  colorGreyDark: '#818a8f',
  borderRounded: '1000px'
};