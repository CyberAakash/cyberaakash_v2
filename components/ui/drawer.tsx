"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

const Drawer = ({
  shouldScaleBackground = false,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn(
      // Overlay: behind sidebar (z-40). Left edge is set by --sidebar-w (set on
      // :root by the admin layout) so the backdrop never covers the sidebar.
      // Fallback 64px = minimum collapsed sidebar width (always applies on mobile/tablet).
      "fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]",
      "transition-opacity",
      className
    )}
    style={{ left: "var(--sidebar-w, 64px)" }}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        // Left edge tracks the sidebar; right: 0 fills to screen edge.
        // --sidebar-w is set on :root by AdminLayout via useEffect so portal
        // elements at <body> level can read it.
        // Fallback 64px = collapsed sidebar (always the case on mobile/tablet).
        "fixed bottom-0 right-0 z-40",
        "flex flex-col",
        "h-[85vh] rounded-t-2xl",
        "border-t border-border/60",
        "bg-background shadow-2xl",
        "transition-[left] duration-200 ease-in-out",
        className
      )}
      style={{ left: "var(--sidebar-w, 64px)" }}
      {...props}
    >
      {/* Drag handle */}
      <div className="mx-auto mt-3 mb-1 h-1 w-10 rounded-full bg-muted-foreground/20 shrink-0" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

/**
 * Sticky header — renders above the scrollable body.
 * Use this for the drawer title + description.
 */
const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col gap-1 px-6 pt-4 pb-3 border-b border-border/40 shrink-0",
      className
    )}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

/**
 * Sticky footer — renders below the scrollable body.
 * Put Save / Cancel buttons here so they're always visible.
 */
const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex gap-3 px-6 py-4 border-t border-border/40 shrink-0 bg-background",
      className
    )}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

/**
 * Scrollable content area — renders between DrawerHeader and DrawerFooter.
 *
 * In vaul v1.x, body-scroll-lock attaches a non-passive 'touchmove' / 'wheel'
 * listener to the document that calls preventDefault(), which blocks natural
 * scrolling even inside overflow-y-auto containers.
 *
 * The fix: attach our OWN capturing listeners with { passive: true } and call
 * stopPropagation() so events that originate inside this element never reach
 * vaul's document-level handler. The { passive: true } flag signals to the
 * browser that we will NOT call preventDefault(), which allows it to handle
 * the scroll natively without waiting for JS.
 */
const DrawerScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, forwardedRef) => {
  const innerRef = React.useRef<HTMLDivElement>(null)

  // Merge the forwarded ref with our inner ref
  const ref = (node: HTMLDivElement | null) => {
    (innerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
    if (typeof forwardedRef === "function") forwardedRef(node)
    else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node
  }

  React.useEffect(() => {
    const el = innerRef.current
    if (!el) return

    const stopWheel = (e: WheelEvent) => e.stopPropagation()
    const stopTouch = (e: TouchEvent) => e.stopPropagation()

    // Use capture phase so we intercept before vaul's bubble-phase handlers.
    // passive:true tells the browser scroll is safe to perform immediately.
    el.addEventListener("wheel",      stopWheel, { passive: true, capture: true })
    el.addEventListener("touchmove",  stopTouch, { passive: true, capture: true })

    return () => {
      el.removeEventListener("wheel",     stopWheel, { capture: true })
      el.removeEventListener("touchmove", stopTouch, { capture: true })
    }
  }, [])

  return (
    <div
      ref={ref}
      data-vaul-no-drag
      className={cn(
        "flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-6",
        className
      )}
      {...props}
    />
  )
})
DrawerScrollArea.displayName = "DrawerScrollArea"

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerScrollArea,
  DrawerTitle,
  DrawerDescription,
}
