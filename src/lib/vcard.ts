export function downloadVCard() {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:NUR AL AMIN
N:Amin;Nur Al;;;
TITLE:Brand Designer
TEL;TYPE=CELL:+8801825668550
EMAIL:hey@nuralamin.com
ADR;TYPE=HOME:;;Uttara, Dhaka;;1000;;Bangladesh
END:VCARD`;

  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Nur_Al_Amin.vcf";
  a.click();
  URL.revokeObjectURL(url);
}
