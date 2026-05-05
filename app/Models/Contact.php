<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends Model
{
    use SoftDeletes;

    public const STATUS_NEW = 'new';
    public const STATUS_CONTACTED = 'contacted';
    public const STATUS_CLOSED = 'closed';

    public const STATUSES = [
        self::STATUS_NEW,
        self::STATUS_CONTACTED,
        self::STATUS_CLOSED,
    ];

    protected $fillable = [
        'personal_name',
        'company_name',
        'phone_number',
        'email',
        'services',
        'more_details',
        'status',
        'notes',
    ];

    protected $casts = [
        'services' => 'array',
    ];
}
