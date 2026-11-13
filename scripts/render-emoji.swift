import AppKit
import CoreText

// Renders Apple Color Emoji glyphs to transparent PNGs at 512px.
// Usage: swift render-emoji.swift <outdir>

let outDir = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "."
let items: [(String, String)] = [
    ("🌎", "globe-americas"),
    ("🌍", "globe-europe-africa"),
    ("🌏", "globe-asia-australia"),
    ("🪜", "ladder"),
]

let side = 512

for (glyph, name) in items {
    guard let rep = NSBitmapImageRep(
        bitmapDataPlanes: nil,
        pixelsWide: side, pixelsHigh: side,
        bitsPerSample: 8, samplesPerPixel: 4,
        hasAlpha: true, isPlanar: false,
        colorSpaceName: .deviceRGB,
        bytesPerRow: 0, bitsPerPixel: 0
    ) else { fatalError("rep") }

    NSGraphicsContext.saveGraphicsState()
    let ctx = NSGraphicsContext(bitmapImageRep: rep)!
    NSGraphicsContext.current = ctx
    ctx.cgContext.clear(CGRect(x: 0, y: 0, width: side, height: side))

    let font = NSFont(name: "Apple Color Emoji", size: 400)!
    let attr = NSAttributedString(string: glyph, attributes: [.font: font])
    let line = CTLineCreateWithAttributedString(attr)
    let bounds = CTLineGetBoundsWithOptions(line, .useGlyphPathBounds)
    ctx.cgContext.textPosition = CGPoint(
        x: (CGFloat(side) - bounds.width) / 2 - bounds.origin.x,
        y: (CGFloat(side) - bounds.height) / 2 - bounds.origin.y
    )
    CTLineDraw(line, ctx.cgContext)

    NSGraphicsContext.restoreGraphicsState()

    let data = rep.representation(using: .png, properties: [:])!
    let url = URL(fileURLWithPath: outDir).appendingPathComponent("\(name).png")
    try! data.write(to: url)
    print("wrote \(url.path) \(rep.pixelsWide)x\(rep.pixelsHigh)")
}
