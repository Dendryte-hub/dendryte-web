import type { APIRoute } from 'astro'
import nodemailer from 'nodemailer'

const emailTo = import meta.env.EMAIL
const emailToPss = import meta.env.PASS
const host = import meta.env.HOST

export const post: APIRoute = async ({ request }) => {
    // console.log('request', request)

    if (request.headers.get('Content-Type') === 'application/json') {
        const formData = await request.json()
        const first_name = formData.first_name
        const last_name = formData.last_name
        const email = formData.email
        const phone_number = formData.phone_number
        const detail = formData.detail
        const message = `${detail}
        ----------------------------------------------------------------------------
        From ${first_name} ${last_name} • ${email} • phone: ${phone_number}
        `
        const html = `<div style="margin: 20px auto;font-family: Helvetica, Verdana, sans-serif">${detail.replace(/[\r\n]/g,
          '<br>'
        )}</div>`

        // sendmail
        let mailTransporter = nodemailer.createTransport({
          host,
          port: 587,
          secure: false,
          auth: {
            user: emailTo,
            pass: emailToPass,
          },
        })

        let mailDetails = {
          from: email,
          to: emailTo,
          subject: `${new URL(request.url).hostname}: ${subject}`
          text: message,
          html,
        }

        let mailResult
        try {
          mailResult = await mailTransporter.sendMail(mailDetails)
        } catch(error) {
            console.log('******* Error: ', error)
        }
        console.log('Message sent: %s', mailResult?.messageId)

        // return endpoint response
        return new Response(JSON.stringify(mailDetails), {
          status: 200,
        })
    }
    return new Response(null, { status: 400 }) // if not a json request
}
