import{l as e,n as t}from"./api.CEs7wFGy.js";var n={draft:`Borrador`,generating:`Generando`,completed:`Completado`,failed:`Fallido`},r=document.querySelector(`#ebooks-table-wrap`),i=document.querySelector(`#ebooks-table`),a=document.querySelector(`#ebooks-empty`),o=document.querySelector(`#ebooks-error`);function s(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`)}async function c(){try{let t=await e();if(!t.items.length){a?.classList.remove(`is-hidden`),r?.classList.add(`is-hidden`);return}if(a?.classList.add(`is-hidden`),r?.classList.remove(`is-hidden`),!i)return;i.innerHTML=t.items.map(e=>`
          <tr>
            <td>${s(e.title||e.topic)}</td>
            <td><span class="status-badge status-${e.status}">${n[e.status]}</span></td>
            <td>${e.total_content_pages}</td>
            <td>${e.active_modules}</td>
            <td>${new Date(e.created_at).toLocaleString()}</td>
            <td>
              <div class="table-actions">
                <a class="button button-secondary" href="/ebooks/${e.id}">Abrir</a>
                <button class="button button-danger" type="button" data-delete="${e.id}">Eliminar</button>
              </div>
            </td>
          </tr>
        `).join(``)}catch{o&&(o.textContent=`No se pudo conectar con el backend.`,o.classList.remove(`is-hidden`))}}i?.addEventListener(`click`,async e=>{let n=e.target;if(!(n instanceof HTMLElement))return;let r=n.dataset.delete;r&&window.confirm(`¿Eliminar este ebook y sus archivos exportados?`)&&(await t(r),await c())}),await c();