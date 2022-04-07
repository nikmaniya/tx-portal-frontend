import { Box, Link, useTheme } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { AppCardButtons, AppCardButtonsProps } from './AppCardButtons'
import { AppCardContent, AppCardContentProps } from './AppCardContent'
import { AppCardImage, AppCardImageProps } from './AppCardImage'

type Variants = 'minimal' | 'compact' | 'expanded' | 'preview' | 'text-only'

export interface AppCardProps
  extends AppCardContentProps,
    AppCardButtonsProps,
    AppCardImageProps {
  variant?: Exclude<Variants, 'preview'>
  filledBackground?: boolean
  expandOnHover?: boolean
  readMoreText?: string
  readMoreLink?: string
}

export const AppCard = ({
  variant: variantProp = 'minimal',
  expandOnHover = false,
  filledBackground,
  title,
  subtitle,
  rating,
  price,
  description,
  image,
  imageSize,
  imageShape,
  buttonText,
  onButtonClick,
  onSecondaryButtonClick,
  readMoreText,
  readMoreLink,
}: AppCardProps) => {
  const { shape, shadows, spacing } = useTheme()
  const [variant, setVariant] = useState(variantProp as Variants)
  const [content, setContent] = useState({
    title,
    subtitle,
  } as AppCardContentProps)
  const boxRef = useRef<HTMLDivElement>(null)
  const [showButton, setShowButton] = useState(false)
  const [boxHeight, setBoxHeight] = useState<number | undefined>()

  useEffect(() => {
    setVariant(variantProp)
  }, [variantProp])

  useEffect(() => {
    switch (variant) {
      case 'compact':
        setContent({ title, subtitle, rating, price })
        break
      case 'text-only':
        setContent({ title, description })
        break
      case 'expanded':
      case 'preview':
        setContent({ title, subtitle, rating, price, description })
        break
      default:
        setContent({ title, subtitle })
    }
  }, [variant, description, price, rating, subtitle, title])

  useEffect(() => {
    setShowButton(['expanded', 'preview'].includes(variant))
  }, [variant])

  useEffect(() => {
    // Set initial box height to prevent flicker on hover
    // TODO: Had to add 37px in height to fit inner content, investigation required
    setBoxHeight(boxRef.current?.getBoundingClientRect().height)
  }, [])

  const onMouseEnter = () => {
    if (expandOnHover) setVariant('preview')
  }
  const onMouseLeave = () => setVariant(variantProp)

  return (
    <div
      ref={boxRef}
      style={{
        position: 'relative',
        height: boxHeight ? `${boxHeight + 37}px` : '',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Box
        sx={{
          backgroundColor: 'common.white',
          borderRadius: shape.borderRadius,
          border: '1px solid',
          borderColor: 'border.border01',
          overflow: 'hidden',
          ':hover': {
            boxShadow: shadows['20'],
          },
          ...(filledBackground === true && {
            backgroundColor: 'background.background02',
            border: 'none',
          }),
          ...(variant === 'preview' && {
            position: 'absolute',
            width: 'calc(100% - 2px)',
            zIndex: 100,
          }),
          ...(variant === 'text-only' && {
            border: 'none',
            ':hover': {
              boxShadow: 'none',
            },
          }),
        }}
        className="app-card"
      >
        <AppCardImage
          image={image}
          imageSize={imageSize}
          imageShape={imageShape}
          preview={variant === 'preview'}
        />
        <Box
          sx={{
            padding: 3,
            ...(variant === 'text-only' && {
              padding: spacing(3, 0),
            }),
          }}
        >
          <AppCardContent {...content} />
          {showButton && (
            <AppCardButtons
              buttonText={buttonText}
              onButtonClick={onButtonClick}
              onSecondaryButtonClick={onSecondaryButtonClick}
            />
          )}
          {variant === 'text-only' && readMoreLink && readMoreText && (
            <Link
              sx={{
                display: 'block',
                marginTop: '10px',
                textDecoration: 'underline',
                fontSize: 'typography.h4.fontSize',
              }}
              href={readMoreLink}
            >
              {readMoreText}
            </Link>
          )}
        </Box>
      </Box>
    </div>
  )
}
