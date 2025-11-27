// Certificate generation utility
export function generateCertificateSVG(
  attendeeName: string,
  eventName: string,
  issueDate: string,
  certificateNumber: string,
): string {
  const formattedDate = new Date(issueDate).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
    <svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
      <!-- Certificate Border -->
      <rect width="1200" height="800" fill="white" stroke="#2d3748" stroke-width="3"/>
      <rect x="20" y="20" width="1160" height="760" fill="none" stroke="#a78bfa" stroke-width="2"/>
      <rect x="30" y="30" width="1140" height="740" fill="none" stroke="#a78bfa" stroke-width="1"/>
      
      <!-- Header -->
      <text x="600" y="80" font-size="48" font-weight="bold" text-anchor="middle" fill="#2d3748">
        CERTIFICATE OF ATTENDANCE
      </text>
      
      <!-- VPAA Logo Area -->
      <circle cx="150" cy="120" r="40" fill="#6366f1" opacity="0.1"/>
      <text x="150" y="130" font-size="20" font-weight="bold" text-anchor="middle" fill="#4f46e5">VPAA</text>
      
      <!-- Main Content -->
      <text x="600" y="200" font-size="32" text-anchor="middle" fill="#2d3748">This certifies that</text>
      
      <!-- Attendee Name -->
      <text x="600" y="280" font-size="56" font-weight="bold" text-anchor="middle" fill="#2d3748">
        ${attendeeName}
      </text>
      <line x1="300" y1="310" x2="900" y2="310" stroke="#2d3748" stroke-width="2"/>
      
      <!-- Description -->
      <text x="600" y="380" font-size="24" text-anchor="middle" fill="#4b5563">has successfully participated in</text>
      
      <!-- Event Name -->
      <text x="600" y="450" font-size="32" font-weight="bold" text-anchor="middle" fill="#4f46e5">
        ${eventName}
      </text>
      
      <!-- Date -->
      <text x="600" y="530" font-size="18" text-anchor="middle" fill="#6b7280">
        Date of Issue: ${formattedDate}
      </text>
      
      <!-- Certificate Number -->
      <text x="150" y="680" font-size="14" fill="#9ca3af">
        Certificate #: ${certificateNumber}
      </text>
      
      <!-- Signature Line -->
      <line x1="800" y1="720" x2="1050" y2="720" stroke="#2d3748" stroke-width="2"/>
      <text x="925" y="750" font-size="14" text-anchor="middle" fill="#2d3748">Authorized Signature</text>
      
      <!-- Footer -->
      <text x="600" y="780" font-size="12" text-anchor="middle" fill="#9ca3af">
        This certificate is awarded in recognition of participation and engagement
      </text>
    </svg>
  `
}

export function downloadCertificate(svgString: string, filename: string) {
  const blob = new Blob([svgString], { type: "image/svg+xml" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
