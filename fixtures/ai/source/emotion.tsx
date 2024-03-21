/* eslint-disable react/no-array-index-key */
import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { blueFillCss, ContainerSection, IconType, rowAndColumnCss, sectionCss } from "./utils";

import { fontWeightSemibold, guttersPx, gutters, greyColor } from "styles/variables";
import { typographyBody1, typographyH3 } from "styles/typography";
import { mediaQuery, mqMin } from "styles/base";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import Icon from "components/ui/SSRIcon";

const ReasonsList = styled(LazyHydrateWrapper)(
  [
    sectionCss(150, 80),
    rowAndColumnCss,
    css`
      ${mqMin.medium} {
        & > * {
          flex-basis: 33.33%;
        }
      }
    `,
  ],
  mediaQuery({
    gap: [60, 80, 150],
  })
).withComponent(ContainerSection);

const ReasonItem = styled.div`
  & > p {
    ${typographyBody1};
    width: 90%;
    color: ${greyColor};
    ${mqMin.medium} {
      width: unset;
    }
  }
`;

const Title = styled.div<{}>([
  typographyH3,
  ({ theme }) =>
    css`
      display: flex;
      align-items: center;
      margin-bottom: ${gutters.large}px;
      color: ${theme.colors.primary};
      font-weight: ${fontWeightSemibold};
      line-height: 1;
      gap: ${guttersPx.small};
    `,
]);

const iconCss = (theme: Theme) => css`
  width: 36px;
  height: 36px;
  opacity: 0.7;
  & > svg {
    ${blueFillCss(theme)};
    width: 100%;
    height: 100%;
  }
`;

export const Reasons = ({
                          iconTitleDescriptions: items,
                        }: {
  iconTitleDescriptions: { icon: IconType; title: string; description: string }[];
}) => {
  return (
    <ReasonsList ssrOnly>
      {items.map(({ title, icon, description }, index) => {
        const I = Icon(icon.svgAsString);
        return (
          <ReasonItem key={index}>
            <Title>
              <I css={iconCss} />
              {title}
            </Title>
            <p>{description}</p>
          </ReasonItem>
        );
      })}
    </ReasonsList>
  );
};
