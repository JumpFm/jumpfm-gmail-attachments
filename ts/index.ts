import { JumpFm } from 'jumpfm-api'
import * as path from 'path'
import Auth from './Auth'
import Gmail from './Gmail'


export const load = (jumpfm: JumpFm) => {
    const getAttachments = (obj: any): { name: string, id: string }[] => {
        if (obj.filename && obj.body && obj.body.attachmentId)
            return [{
                name: obj.filename
                , id: obj.body.attachmentId
            }]
        if (obj.payload) return getAttachments(obj.payload)
        const res = []
        if (!obj.parts) return res
        obj.parts.forEach(part => {
            res.push.apply(res, getAttachments(part))
        })
        return res
    }

    new Auth().getToken().then(auth => {
        const gmail = new Gmail(auth)
        gmail.query('filename:pdf', 10)
            .then(msgs => {
                msgs.forEach(msg => {
                    gmail.get(msg.id)
                        .then(res => console.log(getAttachments(res))
                })
            })
    })
}