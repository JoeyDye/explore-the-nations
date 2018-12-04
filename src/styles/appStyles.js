import styled, { css } from 'styled-components';

const sizes = {
  desktop: 992,
  tablet: 768,
  phone: 576
};

// Iterate through the sizes and create a media template
export const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label] / 16}em) {
      ${css(...args)};
    }
  `;

  return acc;
}, {});

export const Wrapper = styled.div`
  background-color: ${props => props.theme.colorGreyLight};
`;

export const Main = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;

  ${media.tablet`grid-template-columns: 1fr;`};
`;

export const MapSection = styled.main`
  height: 100vh;
  margin: 0;
  padding: 0;

  ${media.tablet`height: 60vh; grid-row: 1 / 2;`};
`;

export const GMap = styled.div`
  height: 100%;
`;
