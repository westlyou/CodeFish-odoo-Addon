"use strict";
odoo.define('pos_retail.screen_product_list', function (require) {

    var models = require('point_of_sale.models');
    var screens = require('point_of_sale.screens');
    var core = require('web.core');
    var utils = require('web.utils');
    var round_pr = utils.round_precision;
    var qweb = core.qweb;
    var rpc = require('pos.rpc');

    screens.ProductScreenWidget.include({
        start: function () {
            this._super();
            var action_buttons = this.action_buttons;
            for (var key in action_buttons) {
                action_buttons[key].appendTo(this.$('.button-list'));
            }
            this.$('.control-buttons').addClass('oe_hidden');
        },
        show: function () {
            var self = this;
            this._super();
            if (this.pos.show_left_buttons == true) {
                $('.buttons_pane').animate({width: 300}, 'fast');
                $('.leftpane').animate({left: 300}, 'fast');
                $('.rightpane').animate({left: 740}, 'fast');
                $('.show_hide_buttons').removeClass('highlight');
                $('.show_hide_buttons .fa-caret-right').toggleClass('fa fa-th fa fa fa-caret-left');
                this.pos.show_left_buttons = true;
            }
            if (this.pos.show_left_buttons == false) {
                $('.buttons_pane').animate({width: 0}, 'fast');
                $('.leftpane').animate({left: 0}, 'fast');
                $('.rightpane').animate({left: 440}, 'fast');
                $('.show_hide_buttons').addClass('highlight');
                $('.fa fa-list').toggleClass('highlight');
                $('.show_hide_buttons .fa-list').toggleClass('fa fa-list fa fa-th');
                this.pos.show_left_buttons = false;
            }
            $('.show_hide_buttons').addClass('highlight');
            // -------------------------------
            // quickly add product
            // quickly add customer
            // quickly payment
            // -------------------------------
            this.$('.add_customer').click(function () { // quickly add customer
                self.pos.gui.show_popup('popup_create_customer', {
                    title: 'Add customer',
                    confirm: function () {
                        var fields = {};
                        $('.partner_input').each(function (idx, el) {
                            fields[el.name] = el.value || false;
                        });
                        if (!fields.name) {
                            return self.pos.gui.show_popup('confirm', {
                                title: 'Error',
                                body: 'A Partner name is required'
                            });
                        }
                        if (this.uploaded_picture) {
                            fields.image = this.uploaded_picture.split(',')[1];
                        }
                        if (fields['partner_type'] == 'customer') {
                            fields['customer'] = true;
                        }
                        if (fields['partner_type'] == 'vendor') {
                            fields['supplier'] = true;
                        }
                        if (fields['partner_type'] == 'customer_and_vendor') {
                            fields['customer'] = true;
                            fields['supplier'] = true;
                        }
                        if (fields['property_product_pricelist']) {
                            fields['property_product_pricelist'] = parseInt(fields['property_product_pricelist'])
                        }
                        return rpc.query({
                            model: 'res.partner',
                            method: 'create',
                            args: [fields]
                        }).then(function (partner_id) {
                            console.log('{partner_id} created : ' + partner_id);
                            return self.pos.gui.show_popup('confirm', {
                                title: 'Done',
                                body: 'Created new partner'
                            })
                        }, function (type, err) {
                            if (err.code && err.code == 200 && err.data && err.data.message && err.data.name) {
                                self.pos.gui.show_popup('confirm', {
                                    title: err.data.name,
                                    body: err.data.message,
                                })
                            } else {
                                self.pos.gui.show_popup('confirm', {
                                    title: 'Error',
                                    body: 'Odoo connection fail, could not save'
                                })
                            }
                        });

                    }
                })
            });
            this.$('.add_product').click(function () { // quickly add product
                self.pos.gui.show_popup('popup_create_product', {
                    title: 'Add product',
                    confirm: function () {
                        var fields = {};
                        $('.product_input').each(function (idx, el) {
                            fields[el.name] = el.value || false;
                        });
                        if (!fields.name) {
                            return self.pos.gui.show_popup('confirm', {
                                title: 'Error',
                                body: 'A Product name is required'
                            });
                        }
                        if (this.uploaded_picture) {
                            fields.image = this.uploaded_picture.split(',')[1];
                        }
                        if (fields['pos_categ_id']) {
                            fields['pos_categ_id'] = parseInt(fields['pos_categ_id'])
                        }
                        return rpc.query({
                            model: 'product.product',
                            method: 'create',
                            args: [fields]
                        }).then(function (product_id) {
                            console.log('{product_id} created : ' + product_id);
                            return self.pos.gui.show_popup('confirm', {
                                title: 'Done',
                                body: 'Created new product'
                            })
                        }, function (type, err) {
                            if (err.code && err.code == 200 && err.data && err.data.message && err.data.name) {
                                self.pos.gui.show_popup('confirm', {
                                    title: err.data.name,
                                    body: err.data.message,
                                })
                            } else {
                                self.pos.gui.show_popup('confirm', {
                                    title: 'Error',
                                    body: 'Odoo connection fail, could not save'
                                })
                            }
                        });

                    }
                })
            });
            this.$('.add_pos_category').click(function () { // quickly add product
                self.pos.gui.show_popup('popup_create_pos_category', {
                    title: 'Add product',
                    confirm: function () {
                        var fields = {};
                        $('.category_input').each(function (idx, el) {
                            fields[el.name] = el.value || false;
                        });
                        if (!fields.name) {
                            return self.pos.gui.show_popup('confirm', {
                                title: 'Error',
                                body: 'Category name is required'
                            });
                        }
                        if (this.uploaded_picture) {
                            fields.image = this.uploaded_picture.split(',')[1];
                        }
                        if (fields['parent_id']) {
                            fields['parent_id'] = parseInt(fields['parent_id'])
                        }
                        return rpc.query({
                            model: 'pos.category',
                            method: 'create',
                            args: [fields]
                        }).then(function (category_id) {
                            console.log('{category_id} created : ' + category_id);
                            return self.pos.gui.show_popup('confirm', {
                                title: 'Done',
                                body: 'Created new category'
                            })
                        }, function (type, err) {
                            if (err.code && err.code == 200 && err.data && err.data.message && err.data.name) {
                                self.pos.gui.show_popup('confirm', {
                                    title: err.data.name,
                                    body: err.data.message,
                                })
                            } else {
                                self.pos.gui.show_popup('confirm', {
                                    title: 'Error',
                                    body: 'Odoo connection fail, could not save'
                                })
                            }
                        });

                    }
                })
            });
            this.$('.quickly_payment').click(function () { // quickly payment
                if (!self.pos.config.quickly_payment_full_journal_id) {
                    return;
                }
                var order = self.pos.get_order();
                if (!order) {
                    return;
                }
                if (order.orderlines.length == 0) {
                    return self.pos.gui.show_popup('confirm', {
                        title: 'Error',
                        body: 'Your order empty'
                    })
                }
                var paymentlines = order.get_paymentlines();
                for (var i = 0; i < paymentlines.length; i++) {
                    paymentlines[i].destroy();
                }
                var register = _.find(self.pos.cashregisters, function (register) {
                    return register['journal']['id'] == self.pos.config.quickly_payment_full_journal_id[0];
                });
                if (!register) {
                    return self.pos.gui.show_popup('confirm', {
                        title: 'Error',
                        body: 'Your config not add quickly payment method, please add before use'
                    })
                }
                var amount_due = order.get_due();
                order.add_paymentline(register);
                var selected_paymentline = order.selected_paymentline;
                selected_paymentline.set_amount(amount_due);
                order.initialize_validation_date();
                self.pos.push_order(order);
                self.pos.gui.show_screen('receipt');

            });
            // change view products
            this.$('.product_list').click(function () {
                self.pos.config.product_view = 'list';
                self.product_list_widget = new screens.ProductListWidget(self, {
                    click_product_action: function (product) {
                        self.click_product(product);
                    },
                    product_list: self.pos.db.get_product_by_category(0)
                });
                self.product_list_widget.replace(self.$('.product-list-container'));
                self.product_categories_widget = new screens.ProductCategoriesWidget(self, {
                    product_list_widget: self.product_list_widget,
                });
                self.$('.category-list-scroller').remove();
                self.$('.categories').remove();
                self.product_categories_widget.replace(self.$('.rightpane-header'));
                $('input').click(function () {
                    self.pos.trigger('remove:keyboard_order');
                })
                self.$('.product_list').addClass('oe_hidden');
                self.$('.product_box').removeClass('oe_hidden');
            });
            this.$('.product_box').click(function () {
                self.pos.config.product_view = 'box';
                self.product_list_widget = new screens.ProductListWidget(self, {
                    click_product_action: function (product) {
                        self.click_product(product);
                    },
                    product_list: self.pos.db.get_product_by_category(0)
                });
                self.product_list_widget.replace(self.$('.product-list-container'));
                self.product_categories_widget = new screens.ProductCategoriesWidget(self, {
                    product_list_widget: self.product_list_widget,
                });
                self.$('.category-list-scroller').remove();
                self.$('.categories').remove();
                self.product_categories_widget.replace(self.$('.rightpane-header'));
                $('input').click(function () {
                    self.pos.trigger('remove:keyboard_order');
                })
                self.$('.product_box').addClass('oe_hidden');
                self.$('.product_list').removeClass('oe_hidden');
            });
            this.$('.lock_session').click(function () {
                $('.pos-content').addClass('oe_hidden');
                $('.pos-topheader').addClass('oe_hidden');
                return self.pos.gui.show_popup('popup_lock_session', {
                    title: 'Locked',
                    body: 'Use pos security pin for unlock',
                    confirm: function (pw) {
                        if (!self.pos.user.pos_security_pin) {
                            $('.pos-content').removeClass('oe_hidden');
                            $('.pos-topheader').removeClass('oe_hidden');
                            return self.pos.gui.close_popup();
                        }
                        else if (pw !== self.pos.user.pos_security_pin) {
                            self.pos.gui.show_popup('confirm', {
                                title: 'Warning',
                                body: 'Wrong pos security pin'
                            });
                            return setTimeout(function () {
                                $('.lock_session').click();
                            }, 2000);
                        } else {
                            $('.pos-content').removeClass('oe_hidden');
                            $('.pos-topheader').removeClass('oe_hidden');
                            return self.pos.gui.close_popup();
                        }
                    }
                });
            });
            this.$('.clear_blank_order').click(function () {
                var orders = self.pos.get('orders');
                var removed = 0;
                for (var i = 1; i < orders.models.length; i++) {
                    var order = orders.models[i];
                    if (order.orderlines.models.length == 0) {
                        order.destroy({'reason': 'abandon'});
                        removed += 1
                    }
                }
                if (removed == 0) {
                    return self.pos.gui.show_popup('confirm', {
                        title: 'Warning',
                        body: 'Your session have not orders blank'
                    });
                }
            });
            this.$('.daily_report').click(function () {
                self.pos.trigger('remove:keyboard_order');
                self.pos.gui.show_screen('daily_report');
            });
            this.$('.print_receipt').click(function () {
                var order = self.pos.get_order();
                if (!order || order.orderlines.length == 0) {
                    return self.pos.gui.show_popup('confirm', {
                        title: 'Warning',
                        body: 'Your Order blank'
                    });
                }
                if (self.pos.config.lock_order_printed_receipt) {
                    self.pos.trigger('remove:keyboard_order');
                    return self.pos.gui.show_popup('confirm', {
                        title: _t('Are you want print receipt?'),
                        body: 'If POS-BOX(printer) is ready config IP, please check receipt at printer, else if POS-BOX and printer not ready will go to Receipt Screen',
                        confirm: function () {
                            var order = self.pos.get_order();
                            if (order) {
                                order['lock'] = true;
                                this.pos.lock_order();
                                if (self.pos.pos_bus) {
                                    this.pos.pos_bus.push_message_to_other_sessions({
                                        data: order.uid,
                                        action: 'lock_order',
                                        bus_id: this.pos.config.bus_id[0],
                                        order_uid: order['uid']
                                    });
                                }
                                return self.pos.gui.show_screen('receipt_review');
                            }
                        }
                    });
                } else {
                    self.pos.trigger('remove:keyboard_order');
                    return self.pos.gui.show_screen('receipt_review');
                }
            });
            var $order_screen_find_product_box = $('.search_products >input');
            $order_screen_find_product_box.autocomplete({
                source: this.pos.db.products_autocomplete,
                minLength: this.pos.config.min_length_search,
                select: function (event, ui) {
                    if (ui && ui['item'] && ui['item']['value'])
                        var product = self.pos.db.get_product_by_id(ui['item']['value']);
                    setTimeout(function () {
                        $('.order-container .searchbox >input').value = '';
                    }, 10);
                    if (product) {
                        return self.pos.get_order().add_product(product);
                    }
                }
            });
            var $find_customer_box = $('.find_customer >input');
            $find_customer_box.autocomplete({
                source: this.pos.db.partners_autocomplete,
                minLength: this.pos.config.min_length_search,
                select: function (event, ui) {
                    if (ui && ui['item'] && ui['item']['value']) {
                        var partner = self.pos.db.partner_by_id[parseInt(ui['item']['value'])];
                        if (partner) {
                            self.pos.get_order().set_client(partner);
                            setTimeout(function () {
                                var input = self.el.querySelector('.find_customer input');
                                input.value = '';
                                input.focus();
                            }, 10);
                        }
                    }
                }
            });
        }
    });

    screens.ProductListWidget.include({
        init: function (parent, options) {
            var self = this;
            this._super(parent, options);
            // bind action only for v10
            // we are only change price of items display, not loop and change all, lost many memory RAM
            this.pos.bind('product:change_price_list', function (products) {
                try {
                    var $products_element = $('.product .product-img .price-tag');
                    for (var i = 0; i < $products_element.length; i++) {
                        var element = $products_element[i];
                        var product_id = parseInt(element.parentElement.parentElement.dataset.productId);
                        var product = self.pos.db.product_by_id(product_id);
                        if (product) {
                            var product = products[i];
                            var $product_el = $("[data-product-id='" + product['id'] + "'] .price-tag");
                            $product_el.html(self.format_currency(product['price']) + '/' + product['uom_id'][1]);
                        }
                    }
                } catch (e) {
                }
            });
            this.pos.bind('sync:product', function (product_data) { // product screen update screen
                self.pos.db.products_autocomplete = _.filter(self.pos.db.products_autocomplete, function (values) {
                    return values['value'] != product_data['id'];
                });
                var label = "";
                if (product_data['default_code']) {
                    label = '[' + product_data['default_code'] + ']'
                }
                if (product_data['barcode']) {
                    label = '[' + product_data['barcode'] + ']'
                }
                if (product_data['display_name']) {
                    label = '[' + product_data['display_name'] + ']'
                }
                if (product_data['description']) {
                    label = '[' + product_data['description'] + ']'
                }
                self.pos.db.products_autocomplete.push({
                    value: product_data['id'],
                    label: label
                });
                if (self.pos.server_version == 10) {
                    self.pos.db.add_products([product_data]);
                    self.pos.db.product_by_id[product_data['id']] = product_data;
                    self.product_cache.cache_node(product_data['id'], null);
                    var product_node = self.render_product(product_data);
                    product_node.addEventListener('click', self.click_product_handler);
                    var $product_el = $(".product-list " + "[data-product-id='" + product_data['id'] + "']");
                    if ($product_el.length > 0) {
                        $product_el.replaceWith(product_node);
                    }
                }
                if (self.pos.server_version == 11) {
                    var using_company_currency = self.pos.config.currency_id[0] === self.pos.company.currency_id[0];
                    var conversion_rate = self.pos.currency.rate / self.pos.company_currency.rate;
                    self.pos.db.add_products(_.map([product_data], function (product) {
                        if (!using_company_currency) {
                            product.lst_price = round_pr(product.lst_price * conversion_rate, self.pos.currency.rounding);
                        }
                        product.categ = _.findWhere(self.pos.product_categories, {'id': product['categ_id'][0]});
                        var product = new models.Product({}, product);
                        var current_pricelist = self._get_active_pricelist();
                        var cache_key = self.calculate_cache_key(product, current_pricelist);
                        self.product_cache.cache_node(cache_key, null);
                        var product_node = self.render_product(product);
                        product_node.addEventListener('click', self.click_product_handler);
                        var contents = self.el.querySelector(".product-list " + "[data-product-id='" + product['id'] + "']");
                        if (contents) {
                            contents.replaceWith(product_node)
                        }
                        return product;
                    }));
                }
            });
            this.mouse_down = false;
            this.moved = false;
            this.auto_tooltip;
            this.product_mouse_down = function (e) {
                if (e.which == 1) {
                    $('#info_tooltip').remove();
                    self.right_arrangement = false;
                    self.moved = false;
                    self.mouse_down = true;
                    self.touch_start(this.dataset.productId, e.pageX, e.pageY);
                }
            };
            this.product_mouse_move = function (e) {
                if (self.mouse_down) {
                    self.moved = true;
                }
            };
        },
        touch_start: function (product_id, x, y) {
            var self = this;
            this.auto_tooltip = setTimeout(function () {
                if (self.moved == false) {
                    this.right_arrangement = false;
                    var product = self.pos.db.get_product_by_id(parseInt(product_id));
                    var inner_html = self.generate_html(product);
                    $('.product-list-container').prepend(inner_html);
                    $(".close_button").on("click", function () {
                        $('#info_tooltip').remove();
                    });
                }
            }, 30);
        },
        generate_html: function (product) {
            var self = this;
            var product_tooltip_html = qweb.render('product_tooltip', {
                widget: self,
                product: product,
                field_load_check: self.pos.db.field_load_check
            });
            return product_tooltip_html;
        },
        touch_end: function () {
            if (this.auto_tooltip) {
                clearTimeout(this.auto_tooltip);
            }
        },
        render_product: function (product) {
            if (this.pos.config.product_view == 'box') {
                return this._super(product)
            } else {
                if (this.pos.server_version == 10) {
                    var cached = this.product_cache.get_node(product.id);
                    if (!cached) {
                        var product_html = qweb.render('Product', {
                            widget: this,
                            product: product,
                            image_url: this.get_product_image_url(product),
                        });
                        var product_node = document.createElement('tbody');
                        product_node.innerHTML = product_html;
                        product_node = product_node.childNodes[1];
                        this.product_cache.cache_node(product.id, product_node);
                        return product_node;
                    }
                    return cached;
                }
                if (this.pos.server_version == 11) {
                    var current_pricelist = this._get_active_pricelist();
                    var cache_key = this.calculate_cache_key(product, current_pricelist);
                    var cached = this.product_cache.get_node(cache_key);
                    if (!cached) {
                        var product_html = qweb.render('Product', {
                            widget: this,
                            product: product,
                            pricelist: current_pricelist,
                            image_url: this.get_product_image_url(product),
                        });
                        var product_node = document.createElement('tbody');
                        product_node.innerHTML = product_html;
                        product_node = product_node.childNodes[1];
                        this.product_cache.cache_node(cache_key, product_node);
                        return product_node;
                    }
                    return cached;
                }
            }
        },
        renderElement: function () {
            if (this.pos.config.product_view == 'box') {
                this._super();
            } else {
                var el_str = qweb.render(this.template, {widget: this});
                var el_node = document.createElement('div');
                el_node.innerHTML = el_str;
                el_node = el_node.childNodes[1];

                if (this.el && this.el.parentNode) {
                    this.el.parentNode.replaceChild(el_node, this.el);
                }
                this.el = el_node;
                var list_container = el_node.querySelector('.product-list-contents');
                if (list_container) {
                    for (var i = 0, len = this.product_list.length; i < len; i++) {
                        var product_node = this.render_product(this.product_list[i]);
                        product_node.addEventListener('click', this.click_product_handler);
                        list_container.appendChild(product_node);
                    }
                }
            }
            if (this.pos.config.tooltip) {
                var caches = this.product_cache;
                for (var cache_key in caches.cache) {
                    var product_node = this.product_cache.get_node(cache_key);
                    product_node.addEventListener('click', this.click_product_handler);
                    product_node.addEventListener('mousedown', this.product_mouse_down);
                    product_node.addEventListener('mousemove', this.product_mouse_move);
                }
                $(".product-list-scroller").scroll(function (event) {
                    $('#info_tooltip').remove();
                });
            }
        },
        _get_active_pricelist: function () {
            var current_order = this.pos.get_order();
            var current_pricelist = this.pos.default_pricelist;
            if (current_order && current_order.pricelist) {
                return this._super()
            } else {
                return current_pricelist
            }
        }
    });
});