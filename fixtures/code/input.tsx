import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { capitalizeFirstLetter } from "styles/base";
import { typographyH5 } from "styles/typography";

export const headingStyles = (theme: Theme) => [
  typographyH5,
  capitalizeFirstLetter,
  css`
    color: ${theme.colors.primary};
    line-height: 24px;
    text-align: center;
  `,
];

// Should be used when you need a heading but don't want it as a h2 tag due to SEO restrictions
export const AntiSectionHeading = styled.div(({ theme }) => [headingStyles(theme)]);

const SectionHeading = styled.h2<{}>(({ theme }) => [headingStyles(theme)]);

export const LeftSectionHeading = styled(SectionHeading)`
  text-align: left;
`;

export default SectionHeading;
