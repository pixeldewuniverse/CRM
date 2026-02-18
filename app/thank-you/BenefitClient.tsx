'use client';

export default function BenefitClient() {
  const onClick = () => {
    console.log('benefit_download_click');
    window.open('/benefit.pdf', '_blank', 'noopener,noreferrer');
  };

  return (
    <button className="btn mt-4 inline-block" onClick={onClick} type="button">
      Download benefit (placeholder)
    </button>
  );
}
