// Copyright (c) 2025, Parwati Bai and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Invoice", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on('Invoice Item', {
    price: update_amount,
    quantity: update_amount,
});

function update_amount(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    row.amount = row.price * row.quantity;
    frm.refresh_field('items');
    update_total(frm);
}

function update_total(frm) {
    let total = 0;
    (frm.doc.items || []).forEach(item => {
        total += item.amount || 0;
    });
    frm.set_value('total_amount', total);
}

frappe.ui.form.on('Invoice', {
    onload(frm) {
        frm.fields_dict.items.grid.wrapper.on('click', '.grid-remove-row', () => {
            setTimeout(() => update_total(frm), 100);
        });
    },
    items_add(frm) {
        update_total(frm);
    },
    validate(frm) {
        update_total(frm);
    },
    refresh(frm) {
        frm.add_custom_button('Download PDF', () => {
            const url = `/api/method/frappe.utils.print_format.download_pdf?doctype=Invoice&name=${frm.doc.name}&format=Standard&no_letterhead=0`;
            window.open(url);
        });
    }
});
