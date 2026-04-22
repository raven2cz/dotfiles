#!/bin/bash
somewm-client eval "local s = require('fishlive.services.updates'); if s._timer then s._timer:emit_signal('timeout') end"
