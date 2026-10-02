import AppKit
import Foundation
let root=CommandLine.arguments[1]
for engine in ["chromium","webkit"] {
  let variants=[("390","light"),("768","light"),("1440","light"),("390","dark"),("768","dark"),("1440","dark")]
  let cellW=320, cellH=420, cols=3, rows=2
  let image=NSImage(size:NSSize(width:cellW*cols,height:cellH*rows))
  image.lockFocus()
  NSColor(calibratedWhite:0.90,alpha:1).setFill();NSRect(x:0,y:0,width:cellW*cols,height:cellH*rows).fill()
  let attrs:[NSAttributedString.Key:Any]=[.font:NSFont.systemFont(ofSize:13,weight:.semibold),.foregroundColor:NSColor.black]
  for (i,(width,theme)) in variants.enumerated(){
    let file="\(engine)-\(width)-\(theme)-runtime.png"
    let path=root+"/"+file
    guard let source=NSImage(contentsOfFile:path) else { fputs("Missing \(path)\n",stderr); exit(1) }
    let sourceSize=source.size
    let scale=min(Double(cellW-16)/sourceSize.width,Double(cellH-32)/sourceSize.height)
    let w=sourceSize.width*scale,h=sourceSize.height*scale
    let x=(i%cols)*cellW+(cellW-Int(w))/2,y=(rows-1-i/cols)*cellH+26
    ("\(width)px · \(theme)" as NSString).draw(at:NSPoint(x:i%cols*cellW+10,y:(rows-1-i/cols)*cellH+7),withAttributes:attrs)
    source.draw(in:NSRect(x:x,y:y,width:Int(w),height:Int(h)))
  }
  image.unlockFocus()
  let tiff=image.tiffRepresentation!,bitmap=NSBitmapImageRep(data:tiff)!,png=bitmap.representation(using:.png,properties:[:])!
  try png.write(to:URL(fileURLWithPath:root+"/\(engine)-contact.png"))
}
