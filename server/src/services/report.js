import models from '@/models'

const { reports } = models
class ReportService {
  createReport = async ({ title, content, user_id }) => {
    const newReport = await reports.create({
      title: title,
      content: content,
      user_id: user_id
    })
    return newReport
  }
  getReportById = async (report_id) => {
    const report = await reports.findByPk(report_id)
    return report
  }
  deleteReport = async (report_id) => {
    const deleted = await reports.destroy({ where: { report_id } })
    return deleted
  }
  updateReport = async (report_id, { title, content }) => {
    const updated = await reports.update(
      { title, content },
      { where: { report_id } }
    )
    return updated
  }
}
export default new ReportService()
