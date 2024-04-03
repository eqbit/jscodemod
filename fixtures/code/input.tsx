import React, { useState, useCallback, useMemo, memo } from 'react';
import rgba from 'polished/lib/color/rgba';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import ArrowRight from '@travelshift/ui/icons/arrow.svg';

import { getTotalPages } from 'utils/helperUtils';
import {
  boxShadowTileRegular,
  whiteColor,
  zIndex,
  lightGreyColor,
  greyColor,
} from 'styles/variables';

const ArrowIcon = styled(ArrowRight, {
  shouldForwardProp: () => false,
})<{
  isBack: boolean;
  isDisabled: boolean;
}>(
  ({ isBack, isDisabled, theme }) =>
    css`
      position: absolute;
      top: 0;
      right: ${isBack ? 16 : 12}px;
      bottom: 0;
      left: ${isBack ? 12 : 16}px;
      margin: auto;
      width: 12px;
      height: auto;
      transform: rotate(${isBack ? '180deg' : '0deg'});
      fill: ${isDisabled ? rgba(greyColor, 0.5) : theme.colors.primary};
    `
);

export const ArrowButtonWrapper = styled.div<{
  isBack: boolean;
  isDisabled: boolean;
}>(({ isBack, isDisabled }) => [
  css`
    position: absolute;
    top: calc(50% - 20px);
    right: ${isBack ? 'unset' : '-20px'};
    left: ${isBack ? '-20px' : 'unset'};
    z-index: ${zIndex.z2};
    display: flex;
    align-items: center;
    box-shadow: ${boxShadowTileRegular};
    border-radius: 50%;
    width: 40px;
    height: 40px;
    background-color: ${whiteColor};
    cursor: pointer;
    user-select: none;
  `,
  isDisabled &&
    css`
      background-color: ${lightGreyColor};
      cursor: default;
    `,
]);

export const CarouselContentWrapper = styled.div<{ fixedHeight?: number }>(
  ({ fixedHeight }) => css`
    height: ${fixedHeight ? `${fixedHeight}px` : 'auto'};
    overflow: hidden;
  `
);

export const Wrapper = styled.div`
  position: relative;
`;

export const ArrowButton = ({
  isBack = false,
  onClick,
  isDisabled,
  className,
}: {
  isBack?: boolean;
  onClick: () => void;
  isDisabled: boolean;
  className?: string;
}) => {
  return (
    <ArrowButtonWrapper
      className={className}
      isBack={isBack}
      onClick={isDisabled ? undefined : onClick}
      isDisabled={isDisabled}
    >
      <ArrowIcon isBack={isBack} isDisabled={isDisabled} />
    </ArrowButtonWrapper>
  );
};

const ContentCarousel = ({
  totalItems,
  itemsPerPage,
  fixedHeight,
  ContentWrapper = React.Fragment,
  renderCarouselContent,
}: {
  totalItems: number;
  itemsPerPage: number;
  fixedHeight?: number;
  ContentWrapper?: React.ElementType;
  renderCarouselContent: (
    firstIndexOfPage: number,
    lastIndexOfPage?: number
  ) => React.ReactElement[];
}) => {
  const totalPages = useMemo(
    () => getTotalPages(totalItems, itemsPerPage),
    [itemsPerPage, totalItems]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const onNextPageClick = useCallback(
    (page: number) => {
      if (page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );
  const onPrevPageClick = useCallback((page: number) => {
    if (page >= 1) {
      setCurrentPage(page);
    }
  }, []);
  const firstIndexOfPage = itemsPerPage * (currentPage - 1);
  const lastIndexOfPage = itemsPerPage * currentPage - 1;
  const content = useMemo(
    () => renderCarouselContent(firstIndexOfPage, lastIndexOfPage),
    [firstIndexOfPage, lastIndexOfPage, renderCarouselContent]
  );

  return (
    <Wrapper>
      {totalPages > 1 && (
        <ArrowButton
          isBack
          onClick={() => onPrevPageClick(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />
      )}
      <CarouselContentWrapper fixedHeight={totalPages > 1 ? fixedHeight : undefined}>
        <ContentWrapper>{content}</ContentWrapper>
      </CarouselContentWrapper>
      {totalPages > 1 && (
        <ArrowButton
          onClick={() => onNextPageClick(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      )}
    </Wrapper>
  );
};

export default memo(ContentCarousel);
