import { CertificatePdfService } from './certificate-pdf.service';

describe('CertificatePdfService', () => {
  const service = new CertificatePdfService();

  it('builds a branded filename and removes invalid Windows characters', () => {
    expect(service.buildFilename('  أحكام: التجويد / المستوى الأول  ', 'course-1')).toBe(
      'Forqan-Certificate-أحكام التجويد المستوى الأول.pdf',
    );
  });

  it('uses the course id when the title has no safe characters', () => {
    expect(service.buildFilename('  <>:"/\\|?*  ', 'course-42')).toBe(
      'Forqan-Certificate-course-42.pdf',
    );
  });
});
